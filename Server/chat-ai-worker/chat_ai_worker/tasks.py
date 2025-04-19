import json
import platform
import requests
from chat_ai_worker.celery_config import celery_app
from loguru import logger
from supabase import create_client
import os
import subprocess
import uuid
import shutil
from pathlib import Path
import tempfile
import re
# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-supabase-url.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-supabase-api-key")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Azure API configuration
API_ENDPOINT = os.getenv("AZURE_OPENAI_API_BASE", "")
API_KEY = os.getenv("AZURE_OPENAI_API_KEY", "")

HEADERS = {
    "Content-Type": "application/json",
    "api-key": API_KEY
}

class APIError(Exception):
    pass

def call_azure_api(system_instruction, user_content, max_tokens=1000):
    try:
        response = requests.post(
            API_ENDPOINT,
            headers=HEADERS,
            json={
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_content}
                ],
                "max_tokens": max_tokens
            }
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()
    except requests.exceptions.RequestException as e:
        raise APIError(f"API call failed: {e}")
    except KeyError:
        raise APIError("Unexpected response format from API.")
    
def check_prompt(user_prompt):
    system_instruction = (
        "You are an intelligent assistant. Your task is to determine whether the given prompt is specifically "
        "intended for creating a 3D object. Valid prompts might or might not describe a 3D object's"
        "specific attributes such as dimensions, shapes, or material properties."
        "The prompt is still valid if there are spelling mistakes. If so assume the correct spelling of the 3D object."
        "For example, instead of 'chair' it is written as 'char', assume the 3D object as 'chair'"
        "Return 'Valid' if the prompt is for creating a 3D object, and 'Invalid' otherwise."
    )
    try:
        response = call_azure_api(system_instruction, user_prompt)
        logger.info("response:", response)    
        if response.lower() == "valid":
            return 
        else:
            raise ValueError("Prompt is not valid for creating a 3D object.")
    except Exception as e:
        logger.error(f"Prompt validation error: {e}")
        raise ValueError(f"Prompt validation error: {e}")
   

def extract_features(user_prompt):
    system_instruction = (
        "You are an intelligent assistant. Your task is to extract all the necessary features, "
        "key dimensions, and attributes for creating a 3D object from the given user prompt and "
        "return the results in structured JSON format. Ensure the JSON is well-formed and human-readable."
        "If attributes for 3D object is not given, then take realistic random values for the attributes."
        "If 3D object has attributes but some attributes are missing, then assume values of these missing "
        "attributes with respect to the provided attributes such that it is consistent."
        "All dimensions should be under the key dimensions."
        "Return only JSON and nothing else."
    )
    try:
        response = call_azure_api(system_instruction, user_prompt)
        clean_content = response.strip("```").strip()
        if clean_content.startswith("json"):
            clean_content = clean_content[4:].strip()
        clean_content = re.split(r"```", clean_content)[0].strip()
        return json.loads(clean_content)
    except APIError as e:
        logger.error(f"Feature extraction error: {e}")
        raise ValueError("Error extracting features from the prompt.")
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON format.")

def generate_python_script(json_content):
    system_instruction = (
        "You are an intelligent assistant tasked with generating Python scripts to create 3D objects based on structured JSON data. "
        "The input JSON data describes a 3D object, including attributes such as dimensions, material properties, and features. "
        "Your task is to generate a well-documented Python script that can create the 3D object as described in the JSON. "
        "The script should: \n"
        "1. Parse the provided JSON data.\n"
        "2. Use Python libraries (such as `numpy-stl`) to generate the geometry and create a 3D model.\n"
        "3. Save the generated 3D model as an STL file.\n"
        "4. Include comments to explain each step in the code clearly.\n\n"
        "If certain attributes in the JSON are missing, assume realistic default values that are consistent with the context of the 3D object. "
        "For example, if wall thickness is missing for a tank, you can use a reasonable default like 5mm.\n\n"
        "The generated Python script should be syntactically correct and ready to execute without requiring significant modifications. "
        "Ensure that the output script is formatted properly, follows Python best practices, and adheres to standard conventions."
        "Return only the Python code and nothing else."
    )
    try:
        response = call_azure_api(system_instruction, json.dumps(json_content))
        clean_content = response.strip("```").strip()
        if clean_content.startswith("python"):
            clean_content = clean_content[6:].strip()
            # print("after clean content:", type(clean_content))
        clean_content = re.split(r"```", clean_content)[0].strip()
        return clean_content
    except APIError as e:
        print(f"Script generation error: {e}")
        raise ValueError("Error generating Python script.")
        return None

# Updated run_python_script function
def run_python_script(script_content, task_folder):
    """
    Run the provided Python script in a specified folder and return the path of the generated STL file.
    """
    script_path = task_folder / "script.py"
    logger.info(f"script path: {script_path}, task_folder: {task_folder}")
    try:
        # Save the Python script to the task folder
        with open(script_path, "w") as script_file:
            script_file.write(script_content)
        
        # Run the script to generate the STL file
        # command = ["python3", script_path] if platform.system() != "Windows" else ["python", script_path]
        command = f" cd {task_folder}  && python script.py"
        subprocess.run(command, check=True, shell=True)

        # Check for any .stl file in the folder
        stl_files = list(task_folder.glob("*.stl"))
        if stl_files:
            return stl_files[0]  # Return the first STL file found
        else:
            logger.error("STL file not generated.")
            raise FileNotFoundError("STL file not generated.")
    except subprocess.CalledProcessError as e:
        logger.error(f"Error running Python script: {e}")
        raise ValueError("Error running Python script.")
        return None
def upload_file_to_supabase(file_path):
    """
    Uploads a file to Supabase storage and returns the public URL.
    """
    try:
        # Generate a unique file name for the upload
        file_name = f"stl_files/{uuid.uuid4().hex}.stl"
        with open(file_path, "rb") as file_data:
            response = supabase.storage.from_("files").upload(file_name, file_data)

        logger.info(f"Response from Supabase: {vars(response)}")  # Log the response vars(response)
        if not response.path or not response.full_path:
            logger.error(f"Unexpected response format from Supabase: {response}")
            return None

        # Construct the public URL using the full_path attribute
        public_url = f"{SUPABASE_URL}/storage/v1/object/public/{response.full_path}"
        logger.info(f"File uploaded successfully. Public URL: {public_url}")
        return public_url

    except Exception as e:
        logger.error(f"Error uploading file to Supabase: {e}")
        raise ValueError("Error uploading file to Supabase.")
        return None
    
    
@celery_app.task(name="tasks.process_message")
def process_message(message_id):
    """
    Celery task to process a user prompt, generate a 3D object STL file, and save the result to Supabase.
    """
    logger.info(f"Processing message with ID: {message_id}")

    # Fetch the message from the database
    response = supabase.table("messages").select("*").eq("id", message_id).execute()
    if not response.data:
        logger.error(f"No message found with ID {message_id}")
        return
    # Update the message status to 'processing'
    supabase.table("messages").update({"status": "processing"}).eq("id", message_id).execute()
    prompt = response.data[0]["request"]
    # Generate a unique folder for the task
    task_folder = Path.cwd() / "tasks" / uuid.uuid4().hex
    task_folder.mkdir(parents=True, exist_ok=True)

    logger.info(f"Processing task_folder: {task_folder}")

    try:
        # Fetch and validate the prompt
        if not prompt:
            logger.error(f"No prompt provided for message ID {message_id}")
            supabase.table("messages").update({
                "status": "failed",
                "error": "No prompt provided."
            }).eq("id", message_id).execute()   
            return
        check_prompt(prompt)
        # Extract features
        features_json = extract_features(prompt)
        if "error" in features_json:
            logger.error(f"Error in feature extraction for message ID {message_id}: {features_json['error']}")
            return

        # Generate Python script
        python_script = generate_python_script(features_json)
        if not python_script:
            logger.error(f"Failed to generate Python script for message ID {message_id}")
            return

        # Run the script to generate the STL file
        generated_file = run_python_script(python_script, task_folder)

        if not generated_file:
            
            logger.error(f"Failed to generate STL file for message ID {message_id}")
            return

        # Upload STL file to Supabase and update the database with the URL
        file_url = upload_file_to_supabase(generated_file)
        if file_url:
            supabase.table("messages").update({
                "response": python_script,
                "stl_url": file_url,
                "status": "success"
            }).eq("id", message_id).execute()
            logger.info(f"Prompt for message ID {message_id} processed successfully. File URL: {file_url}")
        else:
            supabase.table("messages").update({
                "response": python_script,
                "status": "failed",
                "error": "Failed to upload STL file."
            })
            logger.error(f"Failed to upload STL file for message ID {message_id}")
    except Exception as e:
        supabase.table("messages").update({
            "status": "failed",
            "error": str(e) # Convert the exception to a string
        }).eq("id", message_id).execute()
        logger.error(f"Error processing message ID {message_id}: {e}")
    # finally:
    #     # Clean up the temporary folder
    #     if task_folder.exists():
    #         shutil.rmtree(task_folder)

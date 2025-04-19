from typing import List
from fastapi import APIRouter, HTTPException
from chat_ai_fastapi.database import supabase
from chat_ai_fastapi.schemas import CreateConversation, ConversationSchema

router = APIRouter()



@router.post("/conversations", response_model=ConversationSchema)
async def create_conversation(data: CreateConversation):
    """
    Create a new conversation.
    """
    payload = {
        "title": data.title,
        "user_id": data.user_id,
        "status": data.status.value,
    }

    # Insert the conversation into the Supabase table
    response = supabase.table("conversations").insert(payload).execute()

    # Debug the response to verify its structure
    print("Supabase Response:", response)

    # Check if data is None or empty, which indicates a failure
    if not response.data:
        raise HTTPException(
            status_code=500,
            detail="Error creating conversation in Supabase. Check your payload or permissions.",
        )

    # Return the first item in the data array
    return response.data[0]



@router.get("/conversations/{user_id}", response_model=List[ConversationSchema])
async def get_conversations(user_id: str):
    """
    Fetch all conversations for a specific user.
    """
    response = supabase.table("conversations").select("*").eq("user_id", user_id).execute()
    if not response.data:  # If no data is returned, assume an error or no match
        raise HTTPException(
            status_code=404,
            detail=f"No messages found "
        )
    return response.data

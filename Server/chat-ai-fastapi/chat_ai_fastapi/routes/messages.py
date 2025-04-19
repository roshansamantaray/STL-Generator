from fastapi import APIRouter, HTTPException
from chat_ai_fastapi.database import supabase
from chat_ai_fastapi.schemas import CreateMessage, MessageSchema, MessageStatusEnum
from chat_ai_fastapi.celery_config import celery_app
from loguru import logger

router = APIRouter()


@router.post("/messages", response_model=MessageSchema)
async def create_message(data: CreateMessage):
    """
    Add a new message to a conversation and trigger background processing.
    """
    logger.info(f"Received conversation_id: {data.conversation_id}")
    # Check if the conversation exists
    conversation = (
        supabase.table("conversations")
        .select("*")
        .eq("id", str(data.conversation_id))
        .execute()
    )
    if not conversation.data:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Prepare the payload
    payload = {
        "conversation_id": str(data.conversation_id),
        "request": data.request,
        "response": "",  # Default value to satisfy NOT NULL constraint
        "error": None,
        "status": "pending",
        "updated_timestamp": data.updated_timestamp.isoformat(),
    }

    # Insert into Supabase
    response = supabase.table("messages").insert(payload).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create message.")

    # Trigger the Celery task
    message_id = response.data[0]["id"]
    celery_app.send_task("tasks.process_message", args=[message_id])

    return response.data[0]


@router.get("/messages/{message_id}", response_model=list[MessageSchema])
async def get_messages(message_id: str):
    """
    Fetch all messages for a specific conversation.
    """
    # Query Supabase for messages with the given message_id
    response = supabase.table("messages").select("*").eq("id", message_id).execute()

    # Check if the query failed or returned an error
    if not response.data:  # If no data is returned, assume an error or no match
        raise HTTPException(
            status_code=404,
            detail=f"No messages found with id {message_id}",
        )

    # Return the fetched messages
    return response.data

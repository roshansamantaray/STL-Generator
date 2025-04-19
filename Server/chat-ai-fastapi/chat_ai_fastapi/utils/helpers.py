def get_conversation(conversation_id: str):
    """
    Helper to fetch a conversation by ID.
    """
    response = supabase.table("conversations").select("*").eq("id", conversation_id).execute()
    if response.error:
        raise ValueError(response.error.message)
    return response.data

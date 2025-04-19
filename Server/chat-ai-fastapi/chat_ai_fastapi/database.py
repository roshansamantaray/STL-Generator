from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv(verbose=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL or Key is not set in the environment variables.")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

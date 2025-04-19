from fastapi import FastAPI
from chat_ai_fastapi.routes import chat
from chat_ai_fastapi.routes import messages
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Chat AI API")
origins = [
    "http://localhost:3000",  # Frontend development server
    "http://127.0.0.1:3000",  # Alternative local address
    "http://localhost:8000",  # Backend server (optional if calling itself)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies to be included
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(messages.router, prefix="/api/chat", tags=["Chat"])

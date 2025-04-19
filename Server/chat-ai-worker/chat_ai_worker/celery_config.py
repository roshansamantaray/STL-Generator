from celery import Celery
import os
from dotenv import load_dotenv

load_dotenv(verbose=True)

# Celery app setup
celery_app = Celery(
    "chat_ai_worker",
    broker=os.getenv("REDIS_BROKER_URL", "redis://redis:6379/0"),
    backend=os.getenv("REDIS_BACKEND_URL", "redis://redis:6379/1"),
)

# Celery configurations
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    include=["chat_ai_worker.tasks"]  # Updated to reflect the correct path
)
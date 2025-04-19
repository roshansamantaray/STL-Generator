from celery import Celery
import os

from loguru import logger

# Celery configuration
CELERY_BROKER_URL = os.getenv("REDIS_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("REDIS_BACKEND_URL", "redis://localhost:6379/1")

# Initialize Celery app
celery_app = Celery(
    "chat_ai_worker",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND,
)

# Optional configurations
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

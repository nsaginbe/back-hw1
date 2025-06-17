from celery import Celery
import os

# Get Redis URL from environment variable
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Create Celery instance
celery_app = Celery(
    "app",
    broker=redis_url,
    backend=redis_url,
    include=["app.tasks.user_tasks"]  # Include our tasks
)

# Optional configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,  # 1 hour
    worker_max_tasks_per_child=200,  # Restart worker after 200 tasks
    worker_prefetch_multiplier=1,  # Disable prefetch
) 
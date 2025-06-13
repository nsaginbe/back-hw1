from app.celery_app import celery_app
from app.tasks import example, scheduled

__all__ = ["celery_app"] 
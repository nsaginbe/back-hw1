from redis.asyncio import Redis
from functools import lru_cache
import os

@lru_cache()
def get_redis() -> Redis:
    """
    Get Redis connection instance.
    Uses lru_cache to ensure we only create one connection pool.
    """
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    return Redis.from_url(redis_url, decode_responses=True)

async def close_redis_connection():
    """
    Close Redis connection.
    Should be called during application shutdown.
    """
    redis = get_redis()
    await redis.close() 
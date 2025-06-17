from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app import models, schemas
from app.core.redis import get_redis
import json

async def create_user(db: AsyncSession, user: schemas.UserCreate):
    db_user = models.User(email=user.email, password=user.password)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    # Invalidate all user list caches
    redis = get_redis()
    keys = await redis.keys("users:list:*")
    if keys:
        await redis.delete(*keys)
    
    return db_user

async def get_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(models.User).where(models.User.email == email))
    return result.scalar_one_or_none()

async def get_users(db: AsyncSession, skip: int = 0, limit: int = 100):
    redis = get_redis()
    cache_key = f"users:list:{skip}:{limit}"
    
    # Try to get from cache first
    cached_users = await redis.get(cache_key)
    if cached_users:
        return json.loads(cached_users)
    
    # If not in cache, get from database
    result = await db.execute(select(models.User).offset(skip).limit(limit))
    users = result.scalars().all()
    users_data = [schemas.UserRead.model_validate(user).model_dump() for user in users]
    
    # Cache the results for 5 minutes
    await redis.setex(cache_key, 300, json.dumps(users_data))
    return users_data

async def update_user(db: AsyncSession, user_id: int, user: schemas.UserUpdate):
    db_user = await get_user(db, user_id)
    if not db_user:
        return None
    
    update_data = user.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_user, field, value)
    
    await db.commit()
    await db.refresh(db_user)
    
    # Invalidate all user list caches
    redis = get_redis()
    keys = await redis.keys("users:list:*")
    if keys:
        await redis.delete(*keys)
    
    return db_user

async def delete_user(db: AsyncSession, user_id: int):
    db_user = await get_user(db, user_id)
    if not db_user:
        return None
    
    await db.delete(db_user)
    await db.commit()
    
    # Invalidate all user list caches
    redis = get_redis()
    keys = await redis.keys("users:list:*")
    if keys:
        await redis.delete(*keys)
    
    return db_user

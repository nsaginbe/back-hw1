from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app import crud, schemas, database

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schemas.UserRead)
async def create_user(user: schemas.UserCreate, db: AsyncSession = Depends(database.get_db)):
    existing_user = await crud.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return await crud.create_user(db, user)

@router.get("/", response_model=List[schemas.UserRead])
async def read_users(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(database.get_db)):
    users = await crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=schemas.UserRead)
async def read_user(user_id: int, db: AsyncSession = Depends(database.get_db)):
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/{user_id}", response_model=schemas.UserRead)
async def update_user(user_id: int, user: schemas.UserUpdate, db: AsyncSession = Depends(database.get_db)):
    if user.email:
        existing_user = await crud.get_user_by_email(db, user.email)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    updated_user = await crud.update_user(db, user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/{user_id}", response_model=schemas.UserRead)
async def delete_user(user_id: int, db: AsyncSession = Depends(database.get_db)):
    deleted_user = await crud.delete_user(db, user_id)
    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")
    return deleted_user

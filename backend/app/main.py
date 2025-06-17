from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users
from app import models, database
from app.core.redis import close_redis_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        async with database.engine.begin() as conn:
            await conn.run_sync(models.Base.metadata.create_all)
        yield
    finally:
        # Shutdown
        await database.engine.dispose()
        await close_redis_connection()

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)

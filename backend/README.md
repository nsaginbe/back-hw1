# Backend

This is the backend service for the project, built with FastAPI and PostgreSQL.

## Development

1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Run the server:
   ```sh
   uvicorn app.main:app --reload
   ```

## Docker

The backend can be run as a Docker container:

```
docker build -t backend .
docker run -p 8000:8000 --env-file .env backend
```

Or with Docker Compose:
```
docker-compose up --build
```

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string

## Project Structure
- `app/` - FastAPI application code
- `requirements.txt` - Python dependencies
- `Dockerfile` - Container build instructions

### Prerequisites
- Docker & Docker Compose
- (Optional) Python 3.11+
- (Optional) Node.js 20+

### Running with Docker Compose

1. Build and start all services:
   ```powershell
   docker-compose up --build
   ```
2. Backend: http://localhost:8000
3. Frontend: http://localhost:5173
4. Database: localhost:5432 (PostgreSQL)

### Project Structure
- `backend/` - FastAPI backend service
- `frontend/` - Vite/React frontend
- `docker-compose.yml` - Multi-service orchestration

## Useful Commands
- Stop all services:
  ```powershell
  docker-compose down
  ```
- View logs:
  ```powershell
  docker-compose logs
  ```

## Authors
- Your Name

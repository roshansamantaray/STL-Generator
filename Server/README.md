### README: How to Run the Project

This README provides instructions on how to set up and run the `chat-ai-fastapi` and `chat-ai-worker` services using Docker Compose.

---

### Project Structure

```plaintext
D:.
├── chat-ai-fastapi/
│   ├── .env
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── [Application code...]
├── chat-ai-worker/
│   ├── .env
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── [Worker code...]
├── docker-compose.yml  # Parent Compose file
├── .env                # Shared environment variables
```

---

### Prerequisites

Ensure you have the following installed on your system:

1. **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
2. **Docker Compose**: Included with Docker Desktop or [install separately](https://docs.docker.com/compose/install/)

---

### Environment Variables

Create a `.env` file in the **parent directory** with the following content:

```env
SUPABASE_URL=https://etqctowjdgoadulribjv.supabase.co
SUPABASE_KEY=your_supabase_key
SECRET_KEY=your_supabase_sudo_key
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_API_BASE=your_azure_openai_api_base
```

- Replace `your_supabase_key`, `your_azure_openai_api_key`, and `your_azure_openai_api_base` with the actual values.

---

### How to Run the Project

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Ensure the Correct Directory Structure**:
   - The parent folder should contain both `chat-ai-fastapi` and `chat-ai-worker` directories.
   - Ensure the `docker-compose.yml` file is in the **parent directory**.

3. **Build and Start Services**:
   Run the following command from the **parent directory**:
   ```bash
   docker-compose up --build
   ```

   This command:
   - Starts the `redis` service.
   - Builds and runs the `celery-worker`.
   - Builds and runs the `chat-ai-fastapi` service.

4. **Access the Services**:
   - **FastAPI**:
     Open your browser or API client and visit: [http://localhost:8000](http://localhost:8000)
   - **Redis**:
     Redis runs internally on `redis://localhost:6379`.

---

### Stopping the Services

To stop the services, press `CTRL+C` in the terminal or run:
```bash
docker-compose down
```

---

### Troubleshooting

1. **Ensure Docker is Running**:
   - Verify Docker is up and running before starting the services.

2. **Logs**:
   - Check service logs for issues:
     ```bash
     docker-compose logs
     ```

3. **Rebuild Services**:
   - If changes were made to the code or dependencies, rebuild the services:
     ```bash
     docker-compose up --build
     ```

---

### Additional Notes

- **Dependencies**:
  - The `chat-ai-fastapi` and `chat-ai-worker` services use Poetry to manage Python dependencies.
  - Dependencies are automatically installed when the containers are built.

- **Scaling Workers**:
  - To scale the number of Celery workers, use the `--scale` option:
    ```bash
    docker-compose up --scale celery-worker=3 --build
    ```


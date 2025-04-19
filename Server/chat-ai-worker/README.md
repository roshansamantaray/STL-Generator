## **Running Celery for Background Tasks**

This section explains how to set up and run the Celery worker for processing background tasks in the `chat-ai-worker` project.

---

### **Prerequisites**

Before running the Celery worker, ensure the following prerequisites are met:

1. **Redis Server**:
   - Celery requires a message broker. This setup uses Redis.
   - Install Redis:
     - On **Windows**: Use [choco](https://chocolatey.org/) or download from the [Redis official website](https://redis.io/).
     - On **Linux/Mac**: Install via your package manager (`apt`, `brew`, etc.).

   - Start the Redis server:
     ```bash
     redis-server
     ```

2. **Supabase Configuration**:
   - Ensure the environment variables for Supabase are set in a `.env` file:
     ```
     SUPABASE_URL=https://your-supabase-url.supabase.co
     SUPABASE_KEY=your-supabase-api-key
     ```

---

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chat-ai-worker.git
   cd chat-ai-worker
   ```

2. Install dependencies using Poetry:
   ```bash
   poetry install
   ```

---

### **Running the Celery Worker**

1. Activate the Poetry virtual environment:
   ```bash
   poetry shell
   ```

2. Start the Celery worker:

   - For **Windows** (use the `solo` pool):
     ```bash
     celery -A celery_config.celery_app worker --loglevel=info --pool=solo
     ```

   - For **Linux/Mac** (use the default `prefork` pool):
     ```bash
     celery -A celery_config.celery_app worker --loglevel=info
     ```

---

### **Log Details**

- The worker will log its activities to the console, showing task execution progress.
- If you use **Loguru**, logs will also be written to the file specified in the Loguru configuration (e.g., `celery_worker.log`).

Example log output:
```plaintext
[2025-01-11 15:45:02,123: INFO/MainProcess] Connected to redis://localhost:6379/0
[2025-01-11 15:45:02,456: INFO/MainProcess] celery@Allen ready.
[2025-01-11 15:45:15,789: INFO/Worker] Starting to process message with ID: 42
[2025-01-11 15:45:16,123: INFO/Worker] Updated message status to 'processing' for ID: 42
[2025-01-11 15:45:16,456: INFO/Worker] Completed processing for message ID: 42
```

---

### **Verifying Celery Tasks**

1. Ensure the FastAPI app is running and configured to trigger Celery tasks.
2. Use the FastAPI app to create a message and verify the worker processes it.
3. Check the logs for task execution details.

---

### **Troubleshooting**

- **Redis Connection Issues**:
  - Ensure the Redis server is running and accessible at `localhost:6379`.

- **Windows-Specific Errors**:
  - Use the `--pool=solo` option when starting the worker.

- **Task Execution Issues**:
  - Check the Celery logs for errors.
  - Verify the Supabase configuration in your `.env` file.


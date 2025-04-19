# **STL Generator**

This project is a FastAPI-based backend for a Chat AI application using Supabase as the database. It supports conversation management and message handling.

---

## **Prerequisites**

Before running the application, ensure you have the following installed:

- Python 3.10 or later
- [Poetry](https://python-poetry.org/) for dependency management
- A Supabase project with the required tables (`conversations` and `messages`) created.

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone https://github.com/your-username/chat-ai-fastapi.git
cd chat-ai-fastapi
```

### **2. Set Up Environment Variables**

Create a `.env` file in the project root and add the following variables:

```env
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_KEY=your-supabase-api-key
```

### **3. Install Dependencies**

Install Python dependencies using Poetry:

```bash
poetry install
```

### **4. Initialize the Database**

Make sure the following tables exist in your Supabase project:

**Conversations Table:**
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'archived')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);
```

**Messages Table:**
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    request TEXT NOT NULL,
    response TEXT NOT NULL,
    error TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed')),
    updated_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### **5. Start the Development Server**

Activate the virtual environment and start the server:

```bash
poetry shell
poetry run uvicorn chat_ai_fastapi.main:app --reload
```

The API will be accessible at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## **Available Endpoints**

### **Conversations**

- **Create a Conversation**
  ```http
  POST /api/chat/conversations
  ```
  **Request Body:**
  ```json
  {
    "title": "Sample Conversation",
    "user_id": "user123",
    "status": "active"
  }
  ```

- **Get All Conversations**
  ```http
  GET /api/chat/conversations
  ```

### **Messages**

- **Create a Message**
  ```http
  POST /api/chat/messages
  ```
  **Request Body:**
  ```json
  {
    "conversation_id": "uuid-of-the-conversation",
    "request": "Hello!",
    "response": "Hi there!",
    "error": null,
    "updated_timestamp": "2025-01-11T01:15:13.892Z"
  }
  ```

- **Get Messages for a Conversation**
  ```http
  GET /api/chat/messages/{conversation_id}
  ```

---

## **Testing**

Run tests using the following command:

```bash
poetry run pytest
```

---

## **CORS Configuration**

For local development, CORS is enabled for the following origins:
- `http://localhost:3000`
- `http://127.0.0.1:3000`

If you need to modify this, update the `origins` list in `main.py`.

---

## **Deployment**

1. Deploy to a production server or container platform like Docker.
2. Use a production-ready ASGI server (e.g., `gunicorn` with `uvicorn.workers.UvicornWorker`).
3. Update `allow_origins` in `CORSMiddleware` for production domains.

---

## **Contributing**

Feel free to fork the repository and submit pull requests for improvements.

---

## **License**

This project is licensed under the MIT License.

---

Let me know if you need further customizations!
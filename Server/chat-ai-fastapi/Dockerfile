FROM python:3.10-slim

# Install Poetry
RUN pip install poetry

# Set the working directory
WORKDIR /app

# Copy project files to the container
# Copy only dependency files first for efficient caching
COPY pyproject.toml poetry.lock ./

# Configure Poetry to avoid creating virtual environments and install main dependencies only
RUN poetry install --only main --no-root

# Copy the rest of the application


COPY . .

# Expose the application port
EXPOSE 8000

# Use a base image with Python 3.11 to match your project's requirements
FROM python:3.11

# Set the working directory
WORKDIR /app

# Install Poetry globally
RUN pip install --no-cache-dir poetry

# Copy only dependency files first for efficient caching
COPY pyproject.toml poetry.lock ./

# Configure Poetry to avoid creating virtual environments and install main dependencies only
RUN poetry install --only main --no-root

# Copy the rest of the application


COPY . .
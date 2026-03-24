FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system deps (optional but useful)
RUN apt-get update && apt-get install -y build-essential

# Install Python dependencies
RUN pip install ragas

# Run your script
CMD ["python", "main.py"]
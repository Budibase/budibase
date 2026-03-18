FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir ragas datasets openai

COPY ./ragas_runner.py /app/ragas_runner.py

ENTRYPOINT ["python", "/app/ragas_runner.py"]

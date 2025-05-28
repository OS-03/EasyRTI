FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get clean && \
    rm -rf /root/.cache /var/lib/apt/lists/* /tmp/* /app/tests /app/.git

CMD ["uvicorn", "bert_model:app", "--host", "0.0.0.0", "--port", "8000"]
FROM python:3.9

WORKDIR /server
COPY ./server /server

RUN pip install fastapi uvicorn mysql-connector-python python-dotenv pydantic

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]




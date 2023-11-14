# Instruction

## Local Host

1. npm install
2. npm start

## Docker

1. Ensure you have .env file in /src
2. Run:

```bash
docker build . -t <image-name>

docker run -p 6007:6007 <image-name>
```

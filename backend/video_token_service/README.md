# Instruction

## Local Host

1. npm install
2. npm start

## Docker [Development]

1. Ensure you have .env file in /src
2. Run:

```bash
docker build . -f Dockerfile.dev -t <image-name>

docker run -p 5000:5000 <image-name>
```

## Docker [Production]

1. Ensure you have .env file in /src
2. Run:

```bash
docker build . -f Dockerfile -t <image-name>

docker run -p 5000:5000 <image-name>
```

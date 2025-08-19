# Valkey Skyscope

## Getting Started (Development)

### Start Valkey Server

1. Change your working directory to the docker directory:
   ```bash
   cd docker
   ```
2. Run docker compose (This will start your server on `127.0.0.1:6379`):

   ```bash
   docker compose up --build
   ```
3. Add key value pairs using Redis Insight (Optional)

### Running the apps

1. Install all dependencies from the project root:
   ```bash
   npm install
   ```
3. Run both server and frontend:
    ```bash
    npm run dev
    ```






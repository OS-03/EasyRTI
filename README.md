# EasyRTI Portal

An Automated RTI Portal For Indian Citizen

EasyRTI is a comprehensive platform designed to ease the RTI (Right to Information) process. It includes a frontend built with Vite.js and Material UI, a backend powered by Node.js and Express.js , and AI models for text classification and summarization along AI chatbot using puter.js.
#### This project was demonstrated in prakalp 3.0 2025 hackathon held at Fr. Conceicao Rodrigues College of Engineering Bandra, mumbai-400051
---

## Frontend

### How to Run Locally

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Deployment on Render

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Set the **Publish Directory** to `dist` in Render.

3. Add the following environment variable in Render:
   - `VITE_BACKEND_API_URL`: URL of the deployed backend.

---

## Backend

### How to Run Locally

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUD_API_KEY=<your-cloudinary-api-key>
   CLOUD_API_SECRET=<your-cloudinary-api-secret>
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

5. The backend will run on `http://localhost:5000`.

### Deployment on Render

1. Set the **Build Command** to:
   ```bash
   npm install
   ```

2. Set the **Start Command** to:
   ```bash
   npm start
   ```

3. Add the required environment variables in Render:
   - `PORT`
   - `MONGO_URI`
   - `CLOUD_NAME`
   - `CLOUD_API_KEY`
   - `CLOUD_API_SECRET`
   - `FRONTEND_URL`

---

## Model

### How to Run Locally

1. Ensure Python 3.8+ is installed.

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the model server:
   ```bash
   uvicorn bert_model:app
   ```

4. The model will run on `http://127.0.0.1:8000`.

### Deployment on Render

1. Create a **Web Service** for the model.

2. Set the **Start Command** to:
   ```bash
   python app.py
   ```

3. Add any required environment variables (if applicable).

---

## Features

- **Frontend**: Built with Vite.js, Material UI, and TypeScript.
- **Backend**: Node.js, Express, MongoDB, and Cloudinary integration.
- **Model**: AI-powered text classification , summarization , OCR text extraction and Ai speech recoginition and speech synthesis chat bot.

---

## License

This project is licensed under the MIT License.
 for more update refer @ ferozshaikh2222@gmail.com

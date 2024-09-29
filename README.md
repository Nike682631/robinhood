# Stock Trading Simulator

This project is a stock trading simulator based on Robinhood that allows users query and trade stocks.

## Prerequisites

- Node.js (version 18+ or 20+)
- Python (version 3.7+)
- npm, yarn, or pnpm

## Setup

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Create a virtual environment:

   ```
   python -m venv env
   ```

3. Activate the virtual environment:

   - On Windows:
     ```
     .\env\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source env/bin/activate
     ```

4. Install the required Python packages:

   ```
   pip install -r requirements.txt
   ```

5. Set up Firebase:

   - Create a Firebase project at https://console.firebase.google.com/
   - Generate a new private key for your service account
   - Save the private key as `serviceAccountKey.json` in the `backend` directory

6. Create a `.env` file in the `backend` directory with the following content:
   ```
   FLASK_APP=main.py
   FLASK_ENV=development
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:

   - Create a `.env` file in the `frontend` directory
   - Use the `.env.demo` file as a template and replace the values with your own in .env file.

4. Set up Firebase:
   - Add a web app to your Firebase project
   - Copy the Firebase configuration
   - Use the firebase configuration to fill the .env file

## Running the Project

1. Start the backend server:

   ```
   cd backend
   flask run or flask --app main run
   ```

2. In a new terminal, start the frontend development server:

   ```
   cd frontend
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build of the frontend:

```
cd frontend
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `frontend/dist` directory.

For the backend, you'll need to set up a production-ready server like Gunicorn and possibly use a reverse proxy like Nginx. The specific steps will depend on your deployment environment.

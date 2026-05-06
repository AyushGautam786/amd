# NutriHabit AI 🥑🤖

NutriHabit AI is a smart health and food habit platform that helps users make healthier food choices, build sustainable eating habits, and receive contextual AI recommendations. Powered exclusively by Google Gemini AI and built for Google Cloud.

## 🌟 Features

- **AI Meal Recommendations:** Get personalized meal ideas based on your food inventory and fitness goals using Google Gemini.
- **Smart Workout Suggestions:** AI-generated workouts tailored to your body type, fitness level, and available time.
- **AI Health Coach:** Chat with a conversational AI coach for real-time nutrition and wellness advice.
- **Food Inventory System:** Manage your pantry to receive accurate meal recommendations.
- **Habit Tracking:** Track water intake, sleep, meals, workouts, and junk food consumption with streak counters.
- **Premium UI:** Glassmorphism, modern gradients, dark theme, and framer-motion animations.

## 🛠️ Technology Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Shadcn UI
- **Backend:** Next.js API Routes, Server Actions
- **Database:** PostgreSQL (Google Cloud SQL) + Prisma ORM
- **Authentication:** NextAuth.js (Google OAuth)
- **AI:** Google Gemini API (`@google/generative-ai`)
- **Deployment:** Google Cloud Run (Dockerized)

## 🚀 Local Development Setup

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd nutrihabit-ai
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Copy the `.env.example` to `.env` or `.env.local`:
\`\`\`bash
cp .env.example .env
\`\`\`
Fill in the following details:
- `DATABASE_URL`: Your PostgreSQL connection string.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: For Google OAuth via Google Cloud Console.
- `NEXTAUTH_SECRET`: Generate a secret via `openssl rand -base64 32`.
- `NEXTAUTH_URL`: `http://localhost:3000`
- `GEMINI_API_KEY`: Get an API key from Google AI Studio.

### 4. Database Setup
Ensure you have a PostgreSQL database running. Run Prisma migrations:
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

### 5. Run the app
\`\`\`bash
npm run dev
\`\`\`
Visit `http://localhost:3000`

## ☁️ Google Cloud Deployment (Cloud Run)

### 1. Database Setup (Cloud SQL)
1. Create a PostgreSQL instance in Google Cloud SQL.
2. Ensure you have the connection string ready.

### 2. Prepare the Docker Image
The project includes a multi-stage `Dockerfile` optimized for Next.js standalone output.

Build the image locally (optional for testing):
\`\`\`bash
docker build -t nutrihabit-ai .
\`\`\`

### 3. Deploy to Google Cloud Run
You can use the Google Cloud CLI (`gcloud`) or Cloud Build to deploy the application.

Using `gcloud`:
\`\`\`bash
gcloud run deploy nutrihabit-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=your_cloud_sql_url,GEMINI_API_KEY=your_gemini_key,NEXTAUTH_URL=your_service_url,NEXTAUTH_SECRET=your_secret,GOOGLE_CLIENT_ID=your_id,GOOGLE_CLIENT_SECRET=your_secret"
\`\`\`

Ensure you have enabled the necessary APIs:
- Cloud Run API
- Cloud Build API
- Cloud SQL Admin API

## 🚨 Troubleshooting

- **NextAuth Errors:** Ensure `NEXTAUTH_URL` is set correctly to your deployment URL or `localhost`.
- **Database Connection:** If using Google Cloud SQL, ensure the Cloud Run service has the correct permissions and Cloud SQL connector set up.
- **Gemini API:** Verify your API key is valid and has sufficient quota.

## 📄 License
MIT License

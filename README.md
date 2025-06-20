# 🚀 Skill Ascent
A web app for tracking skill progress and learning time.

## 🧪 Getting Started (Fork & Run Locally)

Follow these steps to fork the project, set up your environment, and run it on your local machine.

### 1. Fork the Repository

1. Click the `<>code` button on the top right corner of this page to create a copy under your own GitHub account.
2. Clone your forked repository to your local machine:

```bash
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

### 2.Install Dependencies
npm install
# or
# yarn install

### 3. Create Your .env File
In the root directory, create a .env file and add the required environment variables.
You can use .env.example as a template.

# Example
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

📌 These variables are required to connect to Firebase or other services properly.

4. Run the Development Server

```bash
npm run dev
# or
# yarn dev

Visit http://localhost:3000 to view the app in your browser.




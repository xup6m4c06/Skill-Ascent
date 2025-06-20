# 🚀 Skill Ascent
A web app for tracking skill progress and learning time.

## 🧪 Getting Started (Fork & Run Locally)

Follow these steps to fork the project, set up your environment, and run it on your local machine.

### 🧱 Pre-Step: Create a Project Directory

Before cloning the project, create a folder where you want to store the code:

```bash
mkdir Skill-Ascent
cd Skill-Ascent
```

## 1. Fork the Repository

1. Click the `<>code` button on the top right corner of this page to create a copy under your own GitHub account.
2. Clone your forked repository to your local machine:

```bash
git clone https://github.com/xup6m4c06/Skill-Ascent.git
cd Skill Ascent
```

## 2.Install Dependencies
```bash
npm install
or
yarn install
```

## 3. Create Your .env File
In the root directory, create a .env file and add the required environment variables.
You can use below example as a template.

### Example
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

📌 These variables are required to connect to Firebase or other services properly.
Go to "set up  your own Firebase"


### 4. Run the Development Server

```bash
npm run dev
or
yarn dev
```

Visit http://localhost:3000 to view the app in your browser.


## 🔥 Set Up Your Own Firebase Project
To run this project with your own data, you need to create a Firebase project:

### 1. Go to Firebase Console
Click "Add project"

Give your project a name (e.g., my-skill-tracker)

Disable Google Analytics (optional)

Click "Create project"

### 2. Add a Web App
Go to Project Settings > General

In Your apps, click the </> Web icon to create a new web app

Give it a name, e.g., my-web-app

Click Register app, then copy the config object

Example config:

```bash
const firebaseConfig = {
  apiKey: "AIzaSy...your-key...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 3. Fill in Your .env File
Copy the config values into your .env like this:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```




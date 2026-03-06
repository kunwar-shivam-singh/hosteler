# HOSTELER - Next.js App

This is the **HOSTELER** platform, a mobile-first marketplace for PGs and Hostels built with Next.js, Firebase, and Genkit AI.

## Local Development

To run this project on your local system:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment Variables**:
   Create a `.env.local` file in the root directory and add your Firebase and Google AI API keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Firebase App Hosting (Recommended)
1. Push this code to a GitHub repository.
2. In the Firebase Console, go to **App Hosting** and connect your repository.
3. Firebase will automatically detect the Next.js framework and handle the build/deploy.

### Firebase Hosting
Ensure you have deleted `public/index.html` to prevent the default Firebase welcome page from showing. Then run:
```bash
firebase deploy
```

## Authorized Domains
Don't forget to add your local `localhost` and your production domain `hosteler.in` to the **Authentication > Settings > Authorized Domains** list in the Firebase Console.

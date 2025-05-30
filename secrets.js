export const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
export const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
export const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID; 
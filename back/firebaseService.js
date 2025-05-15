import {initializeApp} from "http://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAnalytics } from "http://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

export const firebaseConfig = {
      apiKey: "AIzaSyCbcrEzEclTnwYbikez1umD3AI8R1dG5Jc",
      authDomain: "caminhosolidario-49761.firebaseapp.com",
      projectId: "caminhosolidario-49761",
      storageBucket: "caminhosolidario-49761.firebasestorage.app",
      messagingSenderId: "370724267395",
      appId: "1:370724267395:web:a1e162926e5283836b82b6",
      measurementId: "G-CQT01YM1N5"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore(app);
    
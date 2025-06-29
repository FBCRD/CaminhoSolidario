import { writeBatch } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, query } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getDoc, doc, deleteDoc, updateDoc, getDocs, where, setDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCbcrEzEclTnwYbikez1umD3AI8R1dG5Jc",
    authDomain: "caminhosolidario-49761.firebaseapp.com",
    projectId: "caminhosolidario-49761",
    storageBucket: "caminhosolidario-49761.firebasestorage.app",
    messagingSenderId: "370724267395",
    appId: "1:370724267395:web:a1e162926e5283836b82b6",
    measurementId: "G-CQT01YM1N5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa o Firestore (banco de dados)
const db = getFirestore(app);

async function alterarSelect(){
    try{
        const docRef = doc(db, "perguntas", "pergunta3");
        await updateDoc(docRef, {
            opcoes: ["Cenoura", "Tomate", "Alface", "Brócolis", "Pepino", "Batata", "Batata-doce", "Abóbora", "Chuchu",
                "Couve", "Espinafre", "Repolho", "Beterraba", "Vagem", "Ervilha", "Milho", "Quiabo", "Rabanete",
                "Berinjela", "Pimentão", "Abobrinha", "Cebola", "Alho", "Salsão", "Aipo", "Mandioquinha"]
        }, { merge: true });
    }catch (error) {
        console.error("Erro ao atualizar o documento:", error);
    }
    
}

alterarSelect();

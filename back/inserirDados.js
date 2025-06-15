import { writeBatch } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, query } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getDoc, doc, deleteDoc, getDocs, where, setDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
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

async function renomearDocumento() {
    
    for (let i = 0; i < 10; i++) {
        const docRefAntigo = doc(db, "perguntas", `p0${i}`);
        const docSnap = await getDoc(docRefAntigo);

        if (docSnap.exists()) {
            const dados = docSnap.data();
            
            // Cria o novo documento com os dados antigos
            await setDoc(doc(db, "perguntas", `pergunta${i}`), dados);
            
            // Exclui o documento antigo
            await deleteDoc(docRefAntigo);
            
            console.log("Documento renomeado com sucesso!");
        } else {
            console.log("Documento antigo não encontrado.");
        }
    }
}

// Exemplo de uso
renomearDocumento("usuarios", "idAntigo", "idNovo");
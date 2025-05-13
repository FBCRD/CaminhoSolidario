// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
 

const form = document.getElementById("formUsuario");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  const turma = document.getElementById("turma").value;

  try {
    await addDoc(collection(db, "usuarios"), {
      nome: nome,
      idade: idade,
      turma: turma
    });
    window.alert("Usuário cadastrado com sucesso!");
    window.location.href = "./home.html";
  } catch (e) {
    console.error("Erro ao adicionar documento: ", e);
    window.alert("Erro ao cadastrar usuário. Tente novamente.");
  }
});


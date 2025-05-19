import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";



// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCbcrEzEclTnwYbikez1umD3AI8R1dG5Jc",
    authDomain: "caminhosolidario-49761.firebaseapp.com",
    projectId: "caminhosolidario-49761",
    storageBucket: "caminhosolidario-49761.firebasestorage.app",
    messagingSenderId: "370724267395",
    appId: "1:370724267395:web:a1e162926e5283836b82b6",
    measurementId: "G-CQT01YM1N5"
};

// Incializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log("Firebase inicializado com sucesso!");
// Inicializa o Firestore
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
    const pagina = detectarPagina();
    if (pagina === "Comecar.html") {
        comecar();
    }
    else if (pagina === "home.html") {
        iniciarHome();
    } else if (pagina === "TelaQuestionario.html") {
        iniciarTelaQuestionario();
    }
    else {
        console.log("Página não reconhecida: " + pagina);
    }

});

function detectarPagina() {
    const urlAtual = window.location.pathname;
    return urlAtual.substring(urlAtual.lastIndexOf("/") + 1);
}













//Tela inicial

async function comecar() {
    
    const nome = document.getElementById("nome").value;
    const turma = document.getElementById("turma").value;
    const idade = document.getElementById("idade").value;
    const form = document.getElementById("formUsuario");
    //Fazer validação dos campos
    if(form){
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const nome = document.getElementById("nome").value;
            const turma = document.getElementById("turma").value;
            const idade = document.getElementById("idade").value;
            //Fazer validação dos campos
            if (nome === "" || turma === "" || idade === "") {
                alert("Preencha todos os campos!");
                return;
            }
            try {
                const usuario = await addDoc(collection(db, "usuarios"), {
                    nome: nome,
                    turma: turma,
                    idade: idade
                });
                
                console.log("Usuário adicionado com sucesso: ", usuario.id);
                
                // window.location.href = "home.html";
            } catch (error) {
                console.error("Erro ao adicionar o documento: ", error);
            }
        });
    }
};
function iniciarHome() {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
        const nome = usuario.nome;
        const span = document.getElementById("nomeUsuario");
        if (span) {
            span.textContent = nome;
        }
    } else {
        window.location.href = "./comecar.html";
    }
}
//Tela de login admin
function logar(event) {
    document.getElementById("formLogin").addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const attlogin = document.getElementById("attlogin").value;
        //Fazer validação dos campos
        if (email !== "fabrodrigues@gmail.com" && senha !== "123") {
            attlogin.textContent = "Email ou senha incorretos!";
            return;
        }
        try {
            const usuario = await addDoc(collection(db, "usuarios"), {
                nome: nome,
                turma: turma,
                idade: idade
            });
            localStorage.setItem("nomeUsuario", usuario.nome);
            window.location.href = "/Telas/home.html";
        } catch (error) {
            console.error("Erro ao adicionar o documento: ", error);
        }
    });



}
//Home
document.addEventListener("DOMContentLoaded", function () {
    // Verifica se o nome do usuário está armazenado no localStorage
    const nome = localStorage.getItem("nomeUsuario");
    if (nome) {
        const span = document.getElementById("nomeUsuario");
        if (span) {
            span.textContent = nome;
        }
    } else {
        window.location.href = "./comecar.html";

    }

});
//Todas as telas
function sair() {
    // Limpa o nome do usuário do localStorage
    localStorage.removeItem("nomeUsuario");
    window.location.href = "Telainicial.html";
}
// Configuração do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";




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
// Inicializa o Firestore (banco de dados)
const db = getFirestore(app);



//Verifica a pagina atual
document.addEventListener("DOMContentLoaded", function () {
    const pagina = detectarPagina();
    if (pagina === "index.html") {
        index();
    }
    else if (pagina === "home.html") {
        iniciarHome();
    } else if (pagina === "telaquestionario.html") {
        console.log("telaQuestionario");
        gerarPerguntas();
        TelaQuestionario();
    }
    else if (pagina ==="teladefinalizacao.html") {
        console.log("telaFinalizacao");
        telaFinal();
    } else {
        console.log("Página não encontrada!" + pagina);
    }

});
//Função para detectar a página atual
function detectarPagina() {
    const url = window.location.pathname;
    let pagina = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
    pagina = pagina.toLowerCase(); // Ignora maiúsculas/minúsculas
    return pagina;
}

//Função cadastro de usuario
async function index() {
    const form = document.getElementById("formUsuario");
    //Fazer validação dos campos
    if (form) {
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
                localStorage.setItem("usuarioId", usuario.id);
                console.log("Usuário adicionado com sucesso: ", usuario.id);

                window.location.href = "home.html";
            } catch (error) {
                console.error("Erro ao adicionar o documento: ", error);
            }
        });
    }
};
//Função para iniciar a home com o nome do usuário, função de sair e ir para o questionário
async function iniciarHome() {
    const usuarioId = localStorage.getItem("usuarioId");
    const docRef = doc(db, "usuarios", usuarioId);
    const docSnap = await getDoc(docRef);
    // Verifica se o usuário está logado
    document.getElementById("sair").addEventListener("click", async function (event) {
        event.preventDefault();
        // Limpa o nome do usuário do localStorage

        window.location.href = "index.html";
        console.log("Usuário deslogado com sucesso!");


    });
    document.getElementById("btnResQuest").addEventListener("click", async function (event) {
        event.preventDefault();
        window.location.href = "telaQuestionario.html";

    });
    if (docSnap.exists()) {
        const usuario = docSnap.data();
        document.getElementById("nomeUsuario").textContent = usuario.nome;
    } else {
        alert("Usuário não encontrado!");
        localStorage.removeItem("usuarioId");
        window.location.href = "index.html";
        window.location.href = "index.html";
    }
}

let numeroPergunta = 1;
async function TelaQuestionario() {
    const usuarioId = localStorage.getItem("usuarioId");
    const form = document.getElementById("formQuestionario");
    //verifica se o usuário está logado
    if (!usuarioId) {
        console.alert("Usuário não encontrado!");
        return;
    }

    await gerarPerguntas();




    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const resposta = document.getElementById("resposta").value;
            //Fazer validação dos campos
            if (resposta === "") {
                alert("Preencha todos os campos!");
                return;
            }
            try {
                const respostaRef = collection(db, "usuarios", usuarioId, "respostas");
                await addDoc(respostaRef, {
                    perguntaId: "p" + numeroPergunta,
                    resposta: resposta
                });
                
                console.log("Resposta enviada com sucesso!");

                numeroPergunta++;
                form.reset(); // Limpa o formulário
                const temMaisPerguntas = await gerarPerguntas();

                if (!temMaisPerguntas) {
                    window.location.href = "/Telas/usuario/teladeFinalizacao.html";
                }
            } catch (error) {
                console.error("Erro ao adicionar o documento: ", error);
            }
        });
    }
    document.getElementById("btnSair").addEventListener("click", async function (event) {
        event.preventDefault();
        // Limpa o nome do usuário do localStorage
        localStorage.removeItem("usuarioId");
        window.location.href = "index.html";
        console.log("Usuário deslogado com sucesso!");
    });

    document.getElementById("btnVoltar").addEventListener("click", async function (event) {
        event.preventDefault();
        history.back();
    });



};
function telaFinal(){
    document.getElementById("btnSair").addEventListener("click", async function (event) {
        event.preventDefault();
        // Limpa o nome do usuário do localStorage
        localStorage.removeItem("usuarioId");
        window.location.href = "index.html";
        console.log("Usuário deslogado com sucesso!");
    });

}







async function gerarPerguntas() {
    const perguntasRef = doc(db, "perguntas", "p" + numeroPergunta);
    const docSnap = await getDoc(perguntasRef);
    const curiosidadesRef = doc(db, "curiosidades", "c" + numeroPergunta);
    const curiosidadesSnap = await getDoc(curiosidadesRef);    
    
    if (docSnap.exists()) {
        const pergunta = docSnap.data();
        const curiosidade = curiosidadesSnap.data();
        document.getElementById("curiosidades").textContent = curiosidade.texto;
        document.getElementById("perguntasquest").textContent = pergunta.pergunta;

        return true;
    } else {
        console.log("Não ha mais perguntas!");
        return false;
    }

};









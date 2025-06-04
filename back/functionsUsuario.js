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
                    perguntaId: "p0" + numeroPergunta,
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



const perguntasComSelect = {
    "2": [
        "Maçã", "Banana", "Uva", "Laranja", "Morango", "Melancia", "Abacaxi", "Pera", "Mamão", "Manga",
        "Kiwi", "Limão", "Coco", "Ameixa", "Cereja", "Goiaba", "Caqui", "Figo", "Maracujá", "Pêssego",
        "Tangerina", "Abacate", "Framboesa", "Amora", "Graviola", "Jabuticaba", "Outras"
    ],
    "3": [
        "Cenoura", "Tomate", "Alface", "Brócolis", "Pepino", "Batata", "Batata-doce", "Abóbora", "Chuchu",
        "Couve", "Espinafre", "Repolho", "Beterraba", "Vagem", "Ervilha", "Milho", "Quiabo", "Rabanete",
        "Berinjela", "Pimentão", "Abobrinha", "Cebola", "Alho", "Salsão", "Aipo", "Mandioquinha", "Outros"
    ],
    "8": ["Fazer doces", "Fazer salgados", "Fazer massas", "Outra coisa"],
    "9": ["Lanches", "Refeições", "Sobremesas"],
};


async function gerarPerguntas() {
    const perguntasRef = doc(db, "perguntas", "p0" + numeroPergunta);
    const docSnap = await getDoc(perguntasRef);
    const curiosidadesRef = doc(db, "curiosidades", "c" + numeroPergunta);
    const curiosidadesSnap = await getDoc(curiosidadesRef);

    if (docSnap.exists()) {
        const pergunta = docSnap.data();
        const curiosidade = curiosidadesSnap.data();

        document.getElementById("curiosidades").textContent = curiosidade ? curiosidade.texto : "";
        document.getElementById("perguntasquest").textContent = pergunta.texto;

        const perguntaId = numeroPergunta.toString();
        const campoResposta = document.getElementById("resposta");

        // Remove o campo anterior (textarea ou select)
        if (campoResposta) {
            campoResposta.remove();
        }

        let novoCampo;

        if (perguntasComSelect[perguntaId]) {
            // Cria SELECT
            novoCampo = document.createElement("select");
            novoCampo.id = "resposta";
            novoCampo.name = "resposta";
            novoCampo.className = "select-personalizado";
            novoCampo.required = true;

            const optionDefault = document.createElement("option");
            optionDefault.value = "";
            optionDefault.text = "Selecione uma opção";
            optionDefault.disabled = true;
            optionDefault.selected = true;
            novoCampo.appendChild(optionDefault);

            perguntasComSelect[perguntaId].forEach(opcao => {
                const option = document.createElement("option");
                option.value = opcao;
                option.textContent = opcao;
                novoCampo.appendChild(option);
            });

        } else {
            // Cria TEXTAREA
            novoCampo = document.createElement("textarea");
            novoCampo.id = "resposta";
            novoCampo.name = "resposta";
            novoCampo.className = "inputs-questionario";
            novoCampo.placeholder = "Responda aqui";
            novoCampo.required = true;
        }

        const form = document.getElementById("formQuestionario");
        form.insertBefore(novoCampo, document.getElementById("btnEnviar"));

        return true;
    } else {
        console.log("Não há mais perguntas!");
        return false;
    }
}

// async function gerarPerguntas() {
//     const perguntasRef = doc(db, "perguntas", "p" + numeroPergunta);
//     const docSnap = await getDoc(perguntasRef);
//     const curiosidadesRef = doc(db, "curiosidades", "c" + numeroPergunta);
//     const curiosidadesSnap = await getDoc(curiosidadesRef);    
    
//     if (docSnap.exists()) {
//         const pergunta = docSnap.data();
//         const curiosidade = curiosidadesSnap.data();
//         document.getElementById("curiosidades").textContent = curiosidade.texto;
//         document.getElementById("perguntasquest").textContent = pergunta.pergunta;

//         return true;
//     } else {
//         console.log("Não ha mais perguntas!");
//         return false;
//     }

// };









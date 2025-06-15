// Configuração do Firebase
//Importações de bibliotecas do firebase que foram utilizadas
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, query } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getDoc, doc, getDocs, where } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";



//Codigo gerado pelo Firebase, cada projeto gera um codigo especifico
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



//Verifica a pagina atual e conforme a pagina em que ele se encontra da inicio ao uso da função respectiva daquela pagina
document.addEventListener("DOMContentLoaded", function () {
    const pagina = detectarPagina();
    if (pagina === "index.html") {
        cadastroUsuario();
    }
    else if (pagina === "home.html") {
        iniciarHome();
    } else if (pagina === "telaquestionario.html") {
        console.log("telaQuestionario");
        gerarPerguntas();
        TelaQuestionario();
    }
    else if (pagina === "teladefinalizacao.html") {
        console.log("telaFinalizacao");
        telaFinal();
    } else if (pagina === "loginusuario.html") {
        console.log("loginUsuario");
        loginUsuario();
    }
    else {
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
async function cadastroUsuario() {
    const form = document.getElementById("formUsuario");
    //Fazer validação dos campos
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const nome = document.getElementById("nome").value;
            const nomeUsuario = document.getElementById("nomeUsuario").value;
            const senha = document.getElementById("senha").value;
            const turma = document.getElementById("turma").value;
            const idade = document.getElementById("idade").value;
            //faz a adição do documento no banco de dados "usuario" no banco de dados
            try {
                const usuario = await addDoc(collection(db, "usuarios"), {
                    nome: nome,
                    nomeUsuario: nomeUsuario,
                    senha: senha,
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

async function loginUsuario() {
    const form = document.getElementById("formLoginUsuario");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const nomeUsuario = document.getElementById("nomeUsuario").value;
        const senha = document.getElementById("senha").value;
        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, where("nomeUsuario", "==", nomeUsuario), where("senha", "==", senha));

        const querySnapshot = await getDocs(q);

        // verifica se encontrou algum documento
        if (!querySnapshot.empty) {
            // pega o primeiro documento retornado
            const doc = querySnapshot.docs[0];

            // salva o ID do usuário
            const userId = doc.id;
            localStorage.setItem("usuarioId", userId);
            console.log("ID do usuário:", userId);
            window.location.href = "home.html";
        } else {
            window.alert("Usuário ou senha incorretos!");
            location.reload();
        }







    })




}



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



//Função para a tela de questionario
//gera perguntas, coleta respostas, botão sair e botão voltar
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
            //Fazer validação do campo de resposta
            if (resposta === "") {
                alert("Preencha todos os campos!");
                return;
            }
            //faz a ligação da resposta com a pergunta
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




//função do botão de sair, da tela Final
async function telaFinal() {
    document.getElementById("btnSair").addEventListener("click", async function (event) {
        event.preventDefault();
        // Limpa o nome do usuário do localStorage
        localStorage.removeItem("usuarioId");
        window.location.href = "index.html";
        console.log("Usuário deslogado com sucesso!");
    });
    const idusuario = localStorage.getItem("usuarioId");
    console.log(idusuario)
    const respostasRef = collection(db, "usuarios", idusuario, "respostas");

    // Faz a query buscando apenas onde perguntaid == "p02"
    const q = query(respostasRef, where("perguntaId", "==", "p02"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log("Usuário ainda não respondeu a pergunta p02.");
        return;
    }

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Resposta da pergunta p02:", data.resposta);

        const fruta = data.resposta;
        if (receitas[fruta]) {
            const receita = receitas[fruta];
            document.getElementById("receita").innerHTML += `
    <h2>Receita: ${receita.titulo}</h2>
    <img src="${receita.imagem}" alt="Imagem de ${receita.titulo}" style="max-width: 300px; display: block; margin: 0 auto;">
    <br><p><strong>Ingredientes:</strong><br>${receita.ingredientes}</p><br>
    <p><strong>Modo de preparo:</strong><br>${receita.preparo}</p>
  `;
        } else {
            document.getElementById("receita").innerHTML += `<p>Desculpe, não temos uma receita para essa fruta ainda.</p>`;
        }

    })
};

function redlogin(){
    
}



//Gerador de perguntas, a cada pergunta gerada, uma curiosidade tambem é chamada


//As perguntas e as curiosidades são inseridas atraves do banco de dados, portanto por enquanto são estaticas
async function gerarPerguntas() {
    const perguntasRef = doc(db, "perguntas", "pergunta" + numeroPergunta);
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

        if (pergunta.select) {
            // Cria select se for pergunta
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

            pergunta.opcoes.forEach(opcao => {
                const option = document.createElement("option");
                option.value = opcao;
                option.textContent = opcao;
                novoCampo.appendChild(option);
            });

        } else {
            // Cria textarea se a resposta for por extenso
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










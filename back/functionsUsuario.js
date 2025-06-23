// Configuração do Firebase
//Importações de bibliotecas do firebase que foram utilizadas
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
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

console.log("Firebase inicializado com sucesso!");
// Inicializa o Firestore (banco de dados)
const db = getFirestore(app);

//Verifica a pagina atual e conforme a pagina em que ele se encontra da inicio ao uso da função respectiva daquela pagina
document.addEventListener("DOMContentLoaded", function () {
    const pagina = detectarPagina();
    if (pagina === "index.html") {
        cadastroUsuario();
        redlogin();
    }
    else if (pagina === "home.html") {
        iniciarHome();
    } else if (pagina === "telaquestionario.html") {
        console.log("telaQuestionario");
        
        TelaQuestionario();
    }
    else if (pagina === "teladefinalizacao.html") {
        console.log("telaFinalizacao");
        telaFinal();
    } else if (pagina === "loginusuario.html") {
        console.log("loginUsuario");
        loginUsuario();
        redCad();
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

//Fazer Login do usuário
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
        
    }
}
// async function TelaQuestionario() {
//     const usuarioId = localStorage.getItem("usuarioId");
//     const form = document.getElementById("formQuestionario");

//     if (!usuarioId) {
//         alert("Usuário não encontrado!");
//         return;
//     }

//     const perguntasSnap = await getDocs(collection(db, "perguntas"));
//     const curiosidadesSnap = await getDocs(collection(db, "curiosidades"));

//     const perguntas = perguntasSnap.docs;
//     const curiosidades = curiosidadesSnap.docs;

//     let indicePergunta = 0;

//     function mostrarPergunta() {
//         if (indicePergunta >= perguntas.length) {
//             window.location.href = "/Telas/usuario/teladeFinalizacao.html";
//             return;
//         }

//         const pergunta = perguntas[indicePergunta].data();
//         const curiosidade = curiosidades.length > 0 ? curiosidades[indicePergunta % curiosidades.length].data() : null;

//         document.getElementById("perguntasquest").textContent = pergunta.texto;
//         document.getElementById("curiosidades").textContent = curiosidade ? curiosidade.texto : "";

//         // Limpar campo antigo
//         const campoAntigo = document.getElementById("resposta");
//         if (campoAntigo) campoAntigo.remove();

//         let novoCampo;

//         if (pergunta.tipo === "select") {
//             novoCampo = document.createElement("select");
//             novoCampo.id = "resposta";
//             novoCampo.name = "resposta";
//             novoCampo.className = "select-personalizado";

//             const optionDefault = document.createElement("option");
//             optionDefault.value = "";
//             optionDefault.text = "Selecione uma opção";
//             optionDefault.disabled = true;
//             optionDefault.selected = true;
//             novoCampo.appendChild(optionDefault);

//             pergunta.opcoes.forEach(opcao => {
//                 const option = document.createElement("option");
//                 option.value = opcao;
//                 option.textContent = opcao;
//                 novoCampo.appendChild(option);
//             });

//         } else {
//             novoCampo = document.createElement("textarea");
//             novoCampo.id = "resposta";
//             novoCampo.name = "resposta";
//             novoCampo.className = "inputs-questionario";
//             novoCampo.placeholder = "Responda aqui";
//         }

//         form.insertBefore(novoCampo, document.getElementById("btnEnviar"));
//     }

//     form.addEventListener("submit", async function (event) {
//         event.preventDefault();
//         const resposta = document.getElementById("resposta").value;

//         if (resposta === "") {
//             alert("Preencha todos os campos!");
//             return;
//         }

//         try {
//             const respostaRef = collection(db, "usuarios", usuarioId, "respostas");
//             await addDoc(respostaRef, {
//                 perguntaId: perguntas[indicePergunta].id,
//                 resposta: resposta
//             });

//             console.log("Resposta enviada com sucesso!");

//             indicePergunta++;
//             form.reset();
//             mostrarPergunta();

//         } catch (error) {
//             console.error("Erro ao adicionar o documento: ", error);
//         }
//     });

    async function TelaQuestionario() {
    const usuarioId = localStorage.getItem("usuarioId");
    const form = document.getElementById("formQuestionario");

    if (!usuarioId) {
        alert("Usuário não encontrado!");
        return;
    }

    const perguntasSnap = await getDocs(collection(db, "perguntas"));
    const curiosidadesSnap = await getDocs(collection(db, "curiosidades"));
    const respostasSnap = await getDocs(collection(db, "usuarios", usuarioId, "respostas"));

    const perguntas = perguntasSnap.docs;
    const curiosidades = curiosidadesSnap.docs;
    const respostas = respostasSnap.docs;

    // Criar um Set com os IDs das perguntas já respondidas
    const perguntasRespondidas = new Set(respostas.map(doc => doc.data().perguntaId));

    // Encontrar o índice da próxima pergunta não respondida
    let indicePergunta = perguntas.findIndex(perguntaDoc => !perguntasRespondidas.has(perguntaDoc.id));

    // Se respondeu todas, mandar direto pra tela final
    if (indicePergunta === -1) {
        window.location.href = "/Telas/usuario/teladeFinalizacao.html";
        return;
    }

    function mostrarPergunta() {
        if (indicePergunta >= perguntas.length) {
            window.location.href = "/Telas/usuario/teladeFinalizacao.html";
            return;
        }

        const pergunta = perguntas[indicePergunta].data();
        const curiosidade = curiosidades.length > 0 ? curiosidades[indicePergunta % curiosidades.length].data() : null;

        document.getElementById("perguntasquest").textContent = pergunta.texto;
        document.getElementById("curiosidades").textContent = curiosidade ? curiosidade.texto : "";

        const campoAntigo = document.getElementById("resposta");
        if (campoAntigo) campoAntigo.remove();

        let novoCampo;

        if (pergunta.tipo === "select") {
            novoCampo = document.createElement("select");
            novoCampo.id = "resposta";
            novoCampo.name = "resposta";
            novoCampo.className = "select-personalizado";

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
            novoCampo = document.createElement("textarea");
            novoCampo.id = "resposta";
            novoCampo.name = "resposta";
            novoCampo.className = "inputs-questionario";
            novoCampo.placeholder = "Responda aqui";
        }

        form.insertBefore(novoCampo, document.getElementById("btnEnviar"));
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const resposta = document.getElementById("resposta").value;

        if (resposta === "") {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const respostaRef = collection(db, "usuarios", usuarioId, "respostas");
            await addDoc(respostaRef, {
                perguntaId: perguntas[indicePergunta].id,
                resposta: resposta
            });

            console.log("Resposta enviada com sucesso!");

            // Avança para próxima não respondida
            indicePergunta++;
            while (indicePergunta < perguntas.length && perguntasRespondidas.has(perguntas[indicePergunta].id)) {
                indicePergunta++;
            }

            form.reset();
            mostrarPergunta();

        } catch (error) {
            console.error("Erro ao adicionar o documento: ", error);
        }
    });

    


    mostrarPergunta();  // Exibir a primeira pergunta ao carregar a tela

    document.getElementById("btnSair").addEventListener("click", () => {
        localStorage.removeItem("usuarioId");
        window.location.href = "index.html";
    });
    
    document.getElementById("btnVoltar").addEventListener("click", () => {
        history.back();
    });
}


//função do botão de sair, da tela Final
async function telaFinal() {
    document.getElementById("btnSair").addEventListener("click", async function (event) {
        event.preventDefault();
        localStorage.removeItem("usuarioId");
        window.location.href = "index.html";
        console.log("Usuário deslogado com sucesso!");
    });

    const idusuario = localStorage.getItem("usuarioId");
    console.log(idusuario);

    const respostasRef = collection(db, "usuarios", idusuario, "respostas");

    
    const pergunta2 = query(respostasRef, where("perguntaId", "==", "pergunta2"));
    const pergunta2Snapshot = await getDocs(pergunta2);

    if (pergunta2Snapshot.empty) {
        console.log("Usuário ainda não respondeu a pergunta sobre frutas.");
        return;
    }

    pergunta2Snapshot.forEach(async (docRes) => {
        const data = docRes.data();
        console.log("Resposta da pergunta sobre frutas:", data.resposta);

        const fruta = data.resposta;

        if (fruta) {
            const receitaRef = doc(db, "receitas", fruta);
            const receitaSnap = await getDoc(receitaRef);

            if (receitaSnap.exists()) {
                const receita = receitaSnap.data();

                document.getElementById("receita").innerHTML += `
                    <h2>Receita: ${receita.titulo}</h2>
                    <img src="${receita.imagem}" alt="Imagem de ${receita.titulo}" style="max-width: 300px; display: block; margin: 0 auto;">
                    <br><p><strong>Ingredientes:</strong><br>${receita.ingredientes}</p><br>
                    <p><strong>Modo de preparo:</strong><br>${receita.preparo}</p>
                `;
            } else {
                document.getElementById("receita").innerHTML += `<p>Desculpe, não temos uma receita para essa fruta ainda.</p>`;
            }
        } else {
            document.getElementById("receita").innerHTML += `<p>Desculpe, não temos uma receita para essa fruta ainda.</p>`;
        }
    });
}
function redlogin() {
    document.getElementById("redlogin").addEventListener("click", async function (event) {
        event.preventDefault();
        window.location.href = "loginUsuario.html";
    });
}
function redCad() {
    document.getElementById("redCad").addEventListener("click", async function (event) {
        event.preventDefault();
        window.location.href = "index.html";
    });
}













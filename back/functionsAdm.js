// Configuração do Firebase
//Importações de bibliotecas do firebase que foram utilizadas
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getDoc, doc, getDocs, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";


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
const auth = getAuth(app);



//Verifica a pagina atual
//Verifica a pagina atual e conforme a pagina em que ele se encontra da inicio ao uso da função respectiva daquela pagina
document.addEventListener("DOMContentLoaded", function () {
    const pagina = detectarPagina();
    if (pagina === "telaloginadm.html") {
        loginAdm();
    }
    else if (pagina === "homeadm.html") {
        HomeAdm();
    } else if (pagina === "usuariosadm.html") {
        console.log("telaQuestionario");
        // Verificando se o usuário está logado
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Usuário logado:", user.email);
                gerarUsuarios();


            } else {

                window.location.href = "TelaLoginAdm.html";
            }
        });
        btns();
    }
    else if (pagina === "respostasadm.html") {
        const urlParams = new URLSearchParams(window.location.search);
        const usuarioId = urlParams.get("id");
        console.log("ID do usuário:", usuarioId);
        carregarRespostas(usuarioId);
        btns();
    }
    else if (pagina === "perguntas.html") {
        listarPerguntas();
        btns();
    } else if (pagina === "receitas.html") {
        console.log("Página de receitas");
        listarReceitas();
        btns();
    }
    else {
        console.error("Página não reconhecida:", pagina);
    }

});
//Função para detectar a página atual
function detectarPagina() {
    const url = window.location.pathname;
    let pagina = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
    pagina = pagina.toLowerCase(); // Ignora maiúsculas/minúsculas
    return pagina;
}

//Função para detectar os botões VOLTAR e SAIR, dentro da pagina
function btns() {
    document.getElementById("btnSair").addEventListener("click", async function (event) {
        event.preventDefault();
        try {
            await auth.signOut();
            console.log("Usuário deslogado com sucesso!");
            window.location.href = "TelaLoginAdm.html";
        } catch (error) {
            console.error("Erro ao deslogar: ", error);
        }
    });
    document.getElementById("btnVoltar").addEventListener("click", async function (event) {
        event.preventDefault();
        history.back();
    });
}


//Função para o adm fazer login
function loginAdm() {
    document.getElementById("formAdmLogin").addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;
        //função do firebase que verifica se o usuario é autorizado a entrar ou não, ele verifica se o email e a senha são os mesmos que foram registrados no autenticador do firebase, diretamente no projeto
        signInWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                // Entrou
                const user = userCredential.user;
                console.log("Usuário logado com sucesso!", user);
                window.location.href = "homeadm.html";
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error("Erro ao logar: ", errorMessage);
                window.alert("Email ou senha incorretos!");
            });




    });


}

//Usado apenas para dar função para os botões da Home Administradora
function HomeAdm() {
    document.getElementById("btnRespostas").addEventListener("click", async function (event) {
        event.preventDefault();
        window.location.href = "usuariosADM.html";
    });
    document.getElementById("btnsair").addEventListener("click", async function (event) {
        event.preventDefault();
        window.location.href = "TelaLoginAdm.html";


    });
    document.getElementById("btnReceitas").addEventListener("click", async function (event) {
        event.preventDefault();
        window.location.href = "receitas.html";
    });
    document.getElementById("btnPerguntas").addEventListener("click", async function (event) {
        event.preventDefault();
        window.location.href = "perguntas.html";
    });


}

//Função que se encontra onde o ADMIN ve os usuarios que responderam as perguntas e leva o ADMIN para o  as respostas do respectivo usuario
window.verRespostas = function (usuarioId) {
    window.location.href = `respostasADM.html?id=${usuarioId}`;
};

//Função que se encontra na tela onde o ADM pode ver os usuarios que responderam, serve para excluir o usuario
window.excluir = async function (usuarioId) {
    //no firebase primeiro é necessario excluir as subcoleções de um documento antes de exclui-lo de fato, abaixo de forma recursiva ele exclui as subcoleções para depois excluir o usuario
    const respostasRef = collection(db, "usuarios", usuarioId, "respostas");
    const snapshot = await getDocs(respostasRef);

    for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
    }

    const docRef = doc(db, "usuarios", usuarioId);
    await deleteDoc(docRef);
    location.reload();
    console.log("Documento deletado");
};


//Função usada para gerar os usuarios, faz a requisição pro banco e cria uma tabela em html mostrando os resultados
async function gerarUsuarios() {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    querySnapshot.forEach((doc) => {
        const usuario = doc.data();
        document.getElementById("tabelaAlunos").innerHTML += `
        <tr>
            <td>${usuario.nome}</td>
            <td>${usuario.turma}</td>
            <td>
                <button class="btn" onclick = "verRespostas('${doc.id}')" >
                    Ver respostas
                </button>
                <button class="btn" onclick = "excluir('${doc.id}')" >
                    Excluir Usuario
                </button>
            </td>
        </tr>`;





    });
}

//Faz a requisição conforme o usuario selecionado e depois mostra em html suas respectivas respostas
async function carregarRespostas(usuarioId) {
    const docRef = doc(db, "usuarios", usuarioId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const dadosUsuario = docSnap.data();
        console.log("Usuário encontrado: ", dadosUsuario.nome);

        const perguntasSnap = await getDocs(collection(db, "perguntas"));
        const respostasSnap = await getDocs(collection(db, "usuarios", usuarioId, "respostas"));

        const perguntas = {};
        perguntasSnap.forEach((doc) => {
            perguntas[doc.id] = doc.data().texto;
            console.log("Pergunta carregada: ", doc.data().texto);
        });

        let num = 1;

        respostasSnap.forEach((doc) => {
            const resposta = doc.data();
            const perguntaId = resposta.perguntaId;

            const perguntaTexto = perguntas[perguntaId] || "Pergunta não encontrada";

            document.getElementById("sectionResp").innerHTML += `
                <div class="card">
                    <div class="badge">${num}</div>
                    <h3>${perguntaTexto}</h3>
                    <p>${resposta.resposta}</p>
                </div>`;

            num++;
        });
        document.getElementById("nomeUsuario").innerText = `Respostas de: ${dadosUsuario.nome}`;
    } else {
        console.log("Usuário não encontrado.");
    }

}

async function listarPerguntas() {
    const perguntasSnap = await getDocs(collection(db, "perguntas"));
    perguntasSnap.forEach((doc) => {
        const pergunta = doc.data();
        console.log("Pergunta: ", pergunta.texto);
        document.getElementById("tabelaperguntas").innerHTML += `<tr>
            <td>${pergunta.texto}</td>
            <td>
                <button class="btn" onclick = "verRespostas('${doc.id}')" >
                    Editar 
                </button>
                <button class="btn" onclick = "excluir('${doc.id}')" >
                    Excluir  
                </button>
            </td>
        </tr>`;
    });
}



function adicionarPergunta(pergunta) {
    const perguntasRef = collection(db, "perguntas");
    addDoc(perguntasRef, {
        texto: pergunta
    })
        .then(() => {
            console.log("Pergunta adicionada com sucesso!");
        })
        .catch((error) => {
            console.error("Erro ao adicionar pergunta: ", error);
        });
}

function editarPergunta(perguntaId, novaPergunta) {
    const perguntaRef = doc(db, "perguntas", perguntaId);
    updateDoc(perguntaRef, {
        texto: novaPergunta
    })
        .then(() => {
            console.log("Pergunta editada com sucesso!");
        })
        .catch((error) => {
            console.error("Erro ao editar pergunta: ", error);
        });
}

function excluirPergunta(perguntaId) {
    const perguntaRef = doc(db, "perguntas", perguntaId);
    deleteDoc(perguntaRef)
        .then(() => {
            console.log("Pergunta excluída com sucesso!");
        })
        .catch((error) => {
            console.error("Erro ao excluir pergunta: ", error);
        });
}

window.abrirModal = async function (receitaid) {
    document.getElementById('modal').style.display = 'block';





    const receitaRef = doc(db, "receitas", receitaid);
    const receitaSnap = await getDoc(receitaRef);
    if (receitaSnap.exists()) {
        const receita = receitaSnap.data();


        document.getElementById("formReceita").innerHTML = `
                   <label for="titulo">Título:</label><br>
                   <input type="text" id="titulo" name="titulo" placeholder="titulo da receita" required value="${receita.titulo}">
                   <br><br>
                   <label for="descricao">Descrição:</label><br>
                   <textarea id="descricao" name="descricao" rows="4" required>${receita.descricao}</textarea><br>
                   <label for="mododepreparo">Modo de preparo:</label><br>
                   <textarea id="mododepreparo" name="mododepreparo" rows="4" required>${receita.preparo}</textarea><br>
                   <label for="ingredientes">Ingredientes:</label><br>
                   <textarea id="ingredientes" name="ingredientes" rows="4" required>${receita.ingredientes}</textarea>
                   <br><br>
                   <label for="image">Imagem:</label><br>
                   <img src="${receita.imagem}" alt="">
                   <input type="text" id="textImage" name="textImage" placeholder="URL da imagem" required value="${receita.imagem}">
                   <br><br>
                   
                   <button id="salvarReceita" type="submit">Salvar</button>
       `;

        document.getElementById("salvarReceita").addEventListener("click", async function (event) {
            event.preventDefault();
            const titulo = document.getElementById("titulo").value;
            const descricao = document.getElementById("descricao").value;
            const mododepreparo = document.getElementById("mododepreparo").value;
            const ingredientes = document.getElementById("ingredientes").value;
            const imglink = document.getElementById("textImage").value;

            try {
                await updateDoc(receitaRef, {
                    titulo: titulo,
                    ingredientes: descricao,
                    preparo: mododepreparo,
                    ingredientes: ingredientes,
                    imagem: imglink
                });
                console.log("Documento atualizado com sucesso");
                location.reload();
            } catch (error) {
                console.error("Erro ao atualizar o documento", error);
            }
        })

    } else {
        console.log("Documento não encontrado!");
    }


    // titulo.innerHTML = receita.titulo;
    // descricao.innerHTML = receita.descricao;
    // mododepreparo.innerHTML = receita.mododepreparo;
    // ingredientes.innerHTML = receita.ingredientes;
    // imglink.innerHTML = receita.imagem
    // updateDoc(receitaRef, {

    // })
};







async function listarReceitas() {
    const receitasSnap = await getDocs(collection(db, "receitas"));
    receitasSnap.forEach((doc) => {
        const receita = doc.data();
        console.log("Receita: ", receita.titulo);
        document.getElementById("cardsReceitas").innerHTML += `
       <div class="card">
                <img src="${receita.imagem}" alt="Imagem da Receita"
                    class="card-image">
                <div class="card-title">${receita.titulo}</div>
                <div class="card-text">
                    Breve descrição da receita. Pode incluir os principais ingredientes ou o modo de preparo resumido.
                </div>
                <button class="edit-button" onclick= "abrirModal('${doc.id}')" >Editar</button>
            </div>
        `;
    });



}



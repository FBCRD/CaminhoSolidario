// Configuração do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";



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
document.addEventListener("DOMContentLoaded", function () {
    const pagina = detectarPagina();
    if (pagina === "telaLoginAdm.html") {
        loginAdm();
    }
    else if (pagina === "homeadm.html") {
        HomeAdm();
    } else if (pagina === "usuariosADM.html") {
        console.log("telaQuestionario");
        // Verificando se o usuário está logado
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Usuário logado:", user.email);
                gerarUsuarios(); // se for a página de usuários
                // carregarRespostas(); // se for a página de respostas
                // gerarRelatorio(); // se for a página de relatórios

            } else {
                alert("Você precisa estar logado como administrador para acessar essa página.");
                window.location.href = "TelaLoginAdm.html";
            }
        });
        btns();
        
    }
    else if (pagina === "respostasADM.html") {
        const urlParams = new URLSearchParams(window.location.search);
        const usuarioId = urlParams.get("id");
        console.log("ID do usuário:", usuarioId);
        carregarRespostas(usuarioId);
        btns();




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

function loginAdm() {
    document.getElementById("formAdmLogin").addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;
        //Fazer validação dos campos
        signInWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("Usuário logado com sucesso!");
                window.location.href = "homeadm.html";
            })
            .catch((error) => {

                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Erro ao logar: ", errorMessage);
                window.alert("Email ou senha incorretos!");
            });




    });


}

function HomeAdm() {
    document.getElementById("btnRespostas").addEventListener("click", async function (event) {
        event.preventDefault();
        window.location.href = "usuariosADM.html";
    });
    document.getElementById("btnsair").addEventListener("click", async function (event) {
        event.preventDefault();
        window.location.href = "comecar.html";


    });



}

window.verRespostas = function (usuarioId) {
    window.location.href = `respostasADM.html?id=${usuarioId}`;
};
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
            </td>
        </tr>`;





    });
}
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
            perguntas[doc.id] = doc.data().pergunta;
            console.log("Pergunta carregada: ", doc.data().pergunta);
        });

        respostasSnap.forEach((doc) => {
            const resposta = doc.data();
            const perguntaId = resposta.perguntaId; // assumindo que o ID da resposta é o ID da pergunta

            const perguntaTexto = perguntas[perguntaId] || "Pergunta não encontrada";

            document.getElementById("sectionResp").innerHTML += `
                <div class="card">
                    <div class="badge">${perguntaId}</div>
                    <h3>${perguntaTexto}</h3>
                    <p>${resposta.resposta}</p>
                </div>`;
        });
        document.getElementById("nomeUsuario").innerText = `Respostas de: ${dadosUsuario.nome}`;
    } else {
        console.log("Usuário não encontrado.");
    }
    
}
















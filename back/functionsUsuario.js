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
            //faz a adição do documento no banco de dados "usuario" no banco de dados
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



const receitas = {
    "Maçã": {
        titulo: "Torta de Maçã",
        ingredientes: "4 maçãs, 1 xícara de açúcar, 1 colher de canela, massa para torta.",
        preparo: "Descasque e corte as maçãs. Misture com açúcar e canela. Forre uma forma com massa, adicione o recheio e cubra. Asse por 40 min a 180°C.",
        imagem: "https://example.com/torta-de-maca.jpg"
    },
    "Banana": {
        titulo: "Bolo de Banana",
        ingredientes: "4 bananas maduras, 2 ovos, 1 xícara de açúcar, 2 xícaras de farinha, 1/2 xícara de óleo, 1 colher de fermento.",
        preparo: "Amasse as bananas e misture com ovos, açúcar e óleo. Adicione farinha e fermento. Asse por 35 min a 180°C.",
        imagem: "https://example.com/bolo-de-banana.jpg"
    },
    "Uva": {
        titulo: "Gelatina Natural de Uva",
        ingredientes: "2 xícaras de uvas, 1 colher de açúcar, 1 envelope de gelatina incolor.",
        preparo: "Bata as uvas com água, coe e misture com a gelatina preparada. Leve à geladeira até firmar.",
        imagem: "https://example.com/gelatina-de-uva.jpg"
    },
    "Laranja": {
        titulo: "Bolo de Laranja",
        ingredientes: "3 ovos, 1 xícara de suco de laranja, 2 xícaras de farinha, 1 xícara de açúcar, 1/2 xícara de óleo, 1 colher de fermento.",
        preparo: "Bata ovos, óleo e suco. Adicione açúcar, farinha e fermento. Asse por 40 min a 180°C.",
        imagem: "https://example.com/bolo-de-laranja.jpg"
    },
    "Morango": {
        titulo: "Vitamina de Morango",
        ingredientes: "1 xícara de morangos, 1 copo de leite, 1 colher de mel.",
        preparo: "Bata tudo no liquidificador. Sirva gelado.",
        imagem: "https://example.com/vitamina-de-morango.jpg"
    },
    "Melancia": {
        titulo: "Suco de Melancia com Hortelã",
        ingredientes: "3 fatias de melancia, folhas de hortelã, gelo.",
        preparo: "Bata melancia com hortelã e gelo. Sirva na hora.",
        imagem: "https://example.com/suco-de-melancia.jpg"
    },
    "Abacaxi": {
        titulo: "Doce de Abacaxi",
        ingredientes: "1 abacaxi picado, 1 xícara de açúcar, 3 cravos-da-índia.",
        preparo: "Cozinhe tudo até formar calda dourada. Sirva frio.",
        imagem: "https://example.com/doce-de-abacaxi.jpg"
    },
    "Pera": {
        titulo: "Peras ao Vinho",
        ingredientes: "4 peras, 1/2 garrafa de vinho tinto, 1/2 xícara de açúcar, 1 pau de canela.",
        preparo: "Cozinhe por 30 min até ficarem macias. Sirva gelado.",
        imagem: "https://example.com/peras-ao-vinho.jpg"
    },
    "Mamão": {
        titulo: "Creme de Mamão",
        ingredientes: "1 mamão pequeno, 1 pote de iogurte, 1 colher de mel.",
        preparo: "Bata tudo no liquidificador e leve à geladeira.",
        imagem: "https://example.com/creme-de-mamao.jpg"
    },
    "Manga": {
        titulo: "Mousse de Manga",
        ingredientes: "2 mangas maduras, 1 lata de leite condensado, 1 caixa de creme de leite.",
        preparo: "Bata tudo e leve à geladeira por 2h.",
        imagem: "https://example.com/mousse-de-manga.jpg"
    },
    "Kiwi": {
        titulo: "Salada de Frutas com Kiwi",
        ingredientes: "2 kiwis, 1 maçã, 1 banana, suco de laranja.",
        preparo: "Corte tudo e regue com suco de laranja.",
        imagem: "https://example.com/salada-de-frutas-com-kiwi.jpg"
    },
    "Limão": {
        titulo: "Mousse de Limão",
        ingredientes: "1 lata de leite condensado, 1 caixa de creme de leite, suco de 3 limões.",
        preparo: "Misture tudo e leve à geladeira.",
        imagem: "https://example.com/mousse-de-limao.jpg"
    },
    "Coco": {
        titulo: "Cocada de Forno",
        ingredientes: "2 xícaras de coco ralado, 1 lata de leite condensado, 1 colher de manteiga.",
        preparo: "Misture tudo, leve ao forno até dourar.",
        imagem: "https://example.com/cocada-de-forno.jpg"
    },
    "Ameixa": {
        titulo: "Doce de Ameixa",
        ingredientes: "2 xícaras de ameixa seca, 1 xícara de açúcar, 1/2 xícara de água.",
        preparo: "Cozinhe até formar uma calda espessa.",
        imagem: "https://example.com/doce-de-ameixa.jpg"
    },
    "Cereja": {
        titulo: "Cheesecake com Cerejas",
        ingredientes: "Base de biscoito, creme de cream cheese, cobertura de cereja.",
        preparo: "Monte as camadas e leve à geladeira.",
        imagem: "https://example.com/cheesecake-com-cerejas.jpg"
    },
    "Goiaba": {
        titulo: "Doce de Goiaba",
        ingredientes: "1 kg de goiabas, 500g de açúcar.",
        preparo: "Cozinhe até formar um doce firme.",
        imagem: "https://example.com/doce-de-goiaba.jpg"
    },
    "Caqui": {
        titulo: "Vitamina de Caqui",
        ingredientes: "2 caquis, 1 copo de leite, 1 colher de açúcar.",
        preparo: "Bata tudo no liquidificador.",
        imagem: "https://example.com/vitamina-de-caqui.jpg"
    },
    "Figo": {
        titulo: "Figos em Calda",
        ingredientes: "10 figos, 1 xícara de açúcar, 1 pau de canela.",
        preparo: "Cozinhe até formar uma calda.",
        imagem: "https://example.com/figos-em-calda.jpg"
    },
    "Maracujá": {
        titulo: "Mousse de Maracujá",
        ingredientes: "1 lata de leite condensado, 1 caixa de creme de leite, suco de 2 maracujás.",
        preparo: "Misture tudo e leve à geladeira por 3h.",
        imagem: "https://example.com/mousse-de-maracuja.jpg"
    },
    "Pêssego": {
        titulo: "Compota de Pêssego",
        ingredientes: "6 pêssegos, 1 xícara de açúcar, 1 xícara de água.",
        preparo: "Cozinhe os pêssegos até a calda engrossar.",
        imagem: "https://example.com/compota-de-pessego.jpg"
    },
    "Tangerina": {
        titulo: "Suco de Tangerina com Gengibre",
        ingredientes: "4 tangerinas, gengibre ralado, gelo.",
        preparo: "Bata tudo e sirva gelado.",
        imagem: "https://example.com/suco-de-tangerina.jpg"
    },
    "Abacate": {
        titulo: "Creme de Abacate",
        ingredientes: "1 abacate, 1 colher de açúcar, gotas de limão.",
        preparo: "Amasse tudo e sirva gelado.",
        imagem: "https://example.com/creme-de-abacate.jpg"
    },
    "Framboesa": {
        titulo: "Smoothie de Framboesa",
        ingredientes: "1 xícara de framboesas, 1 banana, 1 copo de iogurte.",
        preparo: "Bata tudo no liquidificador.",
        imagem: "https://example.com/smoothie-de-framboesa.jpg"
    },
    "Amora": {
        titulo: "Geleia de Amora",
        ingredientes: "2 xícaras de amoras, 1 xícara de açúcar, suco de limão.",
        preparo: "Cozinhe até formar uma geleia.",
        imagem: "https://example.com/geleia-de-amora.jpg"
    },
    "Graviola": {
        titulo: "Suco de Graviola",
        ingredientes: "Polpa de graviola, água, açúcar a gosto.",
        preparo: "Bata tudo e sirva gelado.",
        imagem: "https://example.com/suco-de-graviola.jpg"
    },
    "Jabuticaba": {
        titulo: "Licor de Jabuticaba",
        ingredientes: "1 kg de jabuticabas, 500g de açúcar, cachaça.",
        preparo: "Macere as frutas, adicione açúcar e cachaça. Deixe descansar por 15 dias.",
        imagem: "https://example.com/licor-de-jabuticaba.jpg"
    }
};
//função do botão de sair, da tela Final
async function telaFinal(){
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
    <img src="${receita.imagem}" alt="Imagem de ${receita.titulo}" style="max-width: 300px; display: block; margin-bottom: 10px;">
    <p><strong>Ingredientes:</strong><br>${receita.ingredientes}</p>
    <p><strong>Modo de preparo:</strong><br>${receita.preparo}</p>
  `;
} else {
  document.getElementById("receita").innerHTML += `<p>Desculpe, não temos uma receita para essa fruta ainda.</p>`;
}

}


//Perguntas que precisam de select e suas respectivas respostas
const perguntasComSelect = {
    "2": [
        "Maçã", "Banana", "Uva", "Laranja", "Morango", "Melancia", "Abacaxi", "Pera", "Mamão", "Manga",
        "Kiwi", "Limão", "Coco", "Ameixa", "Cereja", "Goiaba", "Caqui", "Figo", "Maracujá", "Pêssego",
        "Tangerina", "Abacate", "Framboesa", "Amora", "Graviola", "Jabuticaba"
    ],
    "3": [
        "Cenoura", "Tomate", "Alface", "Brócolis", "Pepino", "Batata", "Batata-doce", "Abóbora", "Chuchu",
        "Couve", "Espinafre", "Repolho", "Beterraba", "Vagem", "Ervilha", "Milho", "Quiabo", "Rabanete",
        "Berinjela", "Pimentão", "Abobrinha", "Cebola", "Alho", "Salsão", "Aipo", "Mandioquinha"
    ],
    "8": ["Fazer doces", "Fazer salgados"],
    "9": ["Lanches", "Refeições", "Sobremesas"],
};

//Gerador de perguntas, a cada pergunta gerada, uma curiosidade tambem é chamada


//As perguntas e as curiosidades são inseridas atraves do banco de dados, portanto por enquanto são estaticas
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

            perguntasComSelect[perguntaId].forEach(opcao => {
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









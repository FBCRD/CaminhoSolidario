// Configuração do Firebase
//Importações de bibliotecas do firebase que foram utilizadas
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, doc, getDocs, deleteDoc, updateDoc, query, where, setDoc } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
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
console.log("Firebase inicializado com sucesso!");
// Inicializa o Firestore (banco de dados)
const db = getFirestore(app);
const auth = getAuth(app);




//Verifica a pagina atual e conforme a pagina em que ele se encontra da inicio ao uso da função respectiva daquela pagina
document.addEventListener("DOMContentLoaded", function () {
    const pagina = detectarPagina();
    //Pagina de login do ADM
    if (pagina === "tela-login-adm.html") {
        console.log("Página de login do ADM");
        loginAdm();
    }
    //Pagina inicial do ADM
    else if (pagina === "home-adm.html") {
        console.log("Página inicial do ADM");
        homeAdm();
    }
    //Pagina onde o ADM ve os usuarios que responderam as perguntas
    else if (pagina === "usuarios-adm.html") {
        console.log("Página de usuários do ADM");
        // Verificando se o usuário está logado
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Usuário logado:", user.email);
                gerarUsuarios();

            } else {

                window.location.href = "tela-login-adm.html";
            }
        });
        btns();
    }
    // Carrega as respostas do usuário selecionado
    else if (pagina === "respostas-adm.html") {
        const urlParams = new URLSearchParams(window.location.search);
        const usuarioId = urlParams.get("id");
        console.log("ID do usuário:", usuarioId);
        carregarRespostas(usuarioId);
        btns();
    }
    // Pagina onde o ADM pode adicionar perguntas
    else if (pagina === "perguntas.html") {
        listarPerguntas();
        adicionarPergunta();
        btns();

    }
    // Pagina onde o ADM pode adicionar e editar receitas
    else if (pagina === "receitas.html") {
        console.log("Página de receitas");
        listarReceitas();
        adicionarReceita();
        btns();
    }
    // Pagina onde o ADM pode gerar relatorios
    else if (pagina === "relatorios.html") {
        gerarRelatorio();
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

    return pagina;
}

//Função para detectar os botões VOLTAR e SAIR, dentro da pagina
function btns() {
    document.getElementById("btnSair").addEventListener("click", async function (event) {
        event.preventDefault();
        try {
            await auth.signOut();
            console.log("Usuário deslogado com sucesso!");
            window.location.href = "tela-login-adm.html";
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
                window.location.href = "home-adm.html";
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.error("Erro ao logar: ", errorMessage);
                window.alert("Email ou senha incorretos!");
            });




    });


}

//Usado apenas para dar função para os botões da Home do adm
function homeAdm() {
    document.getElementById("btnRespostas").addEventListener("click", async function (event) {
        event.preventDefault();
        window.location.href = "usuarios-adm.html";
    });
    document.getElementById("btnsair").addEventListener("click", async function (event) {
        event.preventDefault();
        window.location.href = "tela-login-adm.html";


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

//Função para ver as respostas do usuario selecionado, redireciona para a pagina de respostas do ADM
window.verRespostas = function (usuarioId) {
    window.location.href = `respostas-adm.html?id=${usuarioId}`; //Leva para a pagina de respostas com o id do usuario selecionado
};

//Função que se encontra na tela onde o ADM pode ver os usuarios que responderam, serve para excluir o usuario
window.excluir = async function (usuarioId) {
    //no firebase primeiro é necessario excluir as subcoleções de um documento antes de exclui-lo de fato, abaixo de forma recursiva ele exclui as subcoleções para depois excluir o usuario
    console.log("Excluindo usuário com ID:", usuarioId);
    const respostasRef = collection(db, "usuarios", usuarioId, "respostas");//Recupera as respostas do usuario selecionado
    const respostasnapshot = await getDocs(respostasRef);

    for (const doc of respostasnapshot.docs) {//faz a exclusão das respostas do usuario
        await deleteDoc(doc.ref);
    }

    const docRef = doc(db, "usuarios", usuarioId);//Recupera o usuario selecionado
    await deleteDoc(docRef);//apaga o usuario
    location.reload(); //Atualiza a pagina
    console.log("Documento deletado");
};

//Função usada para gerar os usuarios, faz a requisição pro banco e cria uma tabela em html mostrando os resultados
async function gerarUsuarios() {
    const usuariosSnapshot = await getDocs(collection(db, "usuarios"));//Recupera todos os usuarios do banco
    usuariosSnapshot.forEach((doc) => { //Percorre cada usuario e mostra na tabela
        const usuario = doc.data(); //Recupera os dados do usuario
        document.getElementById("tabelaAlunos").innerHTML += `
        <tr>
            <td>${usuario.nome}</td>
            <td>${usuario.turma}</td>
            <td>
                <button class="btn" onclick = "verRespostas('${doc.id}')" >
                    Ver respostas
                </button>
                <button class="btn" onclick = "excluir('${doc.id}')" >
                    Excluir Usuário
                </button>
            </td>
        </tr>`;
    });
    document.getElementById("gerarRel").addEventListener("click", async function (event) {
        event.preventDefault;
        location.href = "relatorios.html";
    })
}

//Faz a requisição conforme o usuario selecionado e depois mostra em html suas respectivas respostas
async function carregarRespostas(usuarioId) {
    const usuarioRef = doc(db, "usuarios", usuarioId);
    const usuarioSnap = await getDoc(usuarioRef);//Recupera o usuario selecionado

    if (usuarioSnap.exists()) { //Verifica se o usuario existe
        const dadosUsuario = usuarioSnap.data();//Recupera os dados do usuario
        console.log("Usuário encontrado: ", dadosUsuario.nome);

        const perguntasSnap = await getDocs(collection(db, "perguntas")); //Recupera todas as perguntas do banco
        const respostasSnap = await getDocs(collection(db, "usuarios", usuarioId, "respostas")); //Recupera todas as respostas da coleção "respostas" do usuario selecionado

        const perguntas = {}; //Cria um objeto para armazenar as perguntas
        perguntasSnap.forEach((doc) => { //Percorre cada pergunta e armazena no objeto
            perguntas[doc.id] = doc.data().texto;
            console.log("Pergunta carregada: ", doc.data().texto);
        });

        //Abre a contagem para demarcar as perguntas
        let num = 1;

        respostasSnap.forEach((doc) => { //Percorre cada resposta do usuario selecionado
            const resposta = doc.data();
            const perguntaId = resposta.perguntaId; //Recupera o id da pergunta

            const perguntaTexto = perguntas[perguntaId] || "Pergunta não encontrada"; //Recupera o texto da pergunta usando o id da pergunta

            //Adiciona as respostas na div  
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
//Excluir pergunta
window.excluirPergunta = async function (perguntaId) {
    if (perguntaId == "pergunta2") {
        alert("Essa pergunta não pode ser excluída, pois é uma pergunta padrão do sistema.");
        return; // Não permite a exclusão da pergunta padrão
    } else {
        const perguntaRef = doc(db, "perguntas", perguntaId);
        deleteDoc(perguntaRef)
            .then(() => {
                console.log("Pergunta excluída com sucesso!");
                location.reload(); // Atualiza a página para refletir a exclusão
            })
            .catch((error) => {
                console.error("Erro ao excluir pergunta: ", error);
            });
    }
}
//Editar pergunta
window.editarPergunta = async function (perguntaId) {
    const perguntaRef = doc(db, "perguntas", perguntaId); // Recupera a referência da pergunta
    const perguntaSnap = await getDoc(perguntaRef); // Recupera o documento da pergunta

    const pergunta = perguntaSnap.data(); // Recupera os dados da pergunta
    document.getElementById('modalPerguntaEditar').style.display = 'block'; // Exibe o modal de edição
    window.adicionarOpcao = adicionarOpcao; // Torna a função de adicionar opção acessível no escopo global
    window.removerOpcao = function (botao) {
        const linha = botao.parentElement;
        linha.remove();
    };
    // Preenche o formulário de edição com os dados da pergunta
    document.getElementById('formPerguntaEditar').innerHTML = `
        <label for="perguntaTexto">Pergunta:</label>
        <input type="text" id="perguntaTextoeditar" name="perguntaTexto" placeholder="Digite a pergunta" required value="${pergunta.texto}">
        
        <label for="tipoPergunta">Tipo da Pergunta:</label>
        <select id="tipoPerguntaeditar" name="tipoPergunta" required>
        <option value="">Selecione o tipo</option>
        <option value="texto">Resposta em Texto</option>
        <option value="select">Múltipla Escolha</option>
        </select>
        <div id="opcoesMultiplaeditar" style="display:none; margin-top: 10px;">
        <label>Opções:</label>
        <div id="listaOpcoeseditar">
        ${pergunta.opcoes.map((opcao, index) => `
    <div class="linha-opcao" style="display: flex; align-items: center; margin-bottom: 5px;">
        <input type="text" name="opcao${index}" value="${opcao}" placeholder="Opção ${index + 1}" required style="flex: 1;">
        <button type="button" onclick="removerOpcao(this)"style="background-color:#00000000; margin-left: 2px; width:2px; color: grey; border: none; border-radius: 4px; ">X</button>
    </div>
`).join('')}
        
        </div>
        <button type="button" onclick="adicionarOpcao()">Adicionar Opção</button>
        </div>
        
        <button type="submit">Salvar Pergunta</button>`;

    // Preenche o tipo de pergunta selecionado
    document.getElementById('tipoPerguntaeditar').addEventListener('change', function () {
        console.log("Tipo de pergunta selecionado:", this.value);
        const tipo = this.value;
        const divOpcoes = document.getElementById('opcoesMultiplaeditar');
        const listaOpcoes = document.getElementById('listaOpcoes');

        // Verifica o tipo de pergunta selecionado
        if (tipo === 'select') {
            console.log("Exibindo opções para múltipla escolha");
            divOpcoes.style.display = 'block'; //abre as opcoes
            listaOpcoes.innerHTML = ''; // Limpa caso já tenha algo
            // Já começa com um campo de opção
        } else {
            divOpcoes.style.display = 'none';
            listaOpcoes.innerHTML = '';
        }
    });
    const textoPergunta = document.getElementById('perguntaTextoeditar');
    const tipoPergunta = document.getElementById('tipoPerguntaeditar');

    try {
        document.getElementById('formPerguntaEditar').addEventListener('submit', function (e) {
            e.preventDefault();
            // Atualiza a pergunta no Firestore
            updateDoc(perguntaRef, {
                texto: textoPergunta.value,
                tipo: tipoPergunta.value,
                opcoes: Array.from(document.querySelectorAll('#listaOpcoeseditar input')).map(input => input.value)
            })
            console.log("Pergunta atualizada com sucesso!");
            // Atualiza a página para refletir as mudanças
            fecharModalPerguntaEditar();
        })
    } catch (error) {
        console.error("Erro ao atualizar pergunta:", error);
    }
}

//Fechar Modal de edição de perguntas
function fecharModalPerguntaEditar() {
    document.getElementById('modalPerguntaEditar').style.display = 'none';
    document.getElementById('formPerguntaEditar').reset();
    document.getElementById('listaOpcoeseditar').innerHTML = ''; // Limpa as opções
    console.log("Modal de edição fechado e formulário resetado.");
    //ao fechar o modal ele demora 1 segundo para atualizar, pq estava dando problema quando atualizava automaticamente
    setTimeout(() => {
        location.reload();
    }, 1000);
}

//Função para adicionar opções de múltipla escolha na edição de perguntas
function adicionarOpcao() {
    const listaOpcoes = document.getElementById('listaOpcoeseditar');
    const index = listaOpcoes.children.length; // Número da nova opção

    // Cria container da linha (input + botão X)
    const linha = document.createElement('div');
    linha.className = 'linha-opcao';
    linha.style.display = 'flex';
    linha.style.alignItems = 'center';
    linha.style.marginBottom = '5px';

    // Cria o input
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'opcao' + index;
    input.placeholder = 'Nova opção ';
    input.required = true;
    input.style.flex = '1';

    // Cria o botão de remover
    const botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.textContent = 'X';
    botaoRemover.style.marginLeft = '0px';
    botaoRemover.style.backgroundColor = '#00000000';
    botaoRemover.style.color = 'grey';
    botaoRemover.style.border = 'none';
    botaoRemover.style.borderRadius = '4px';
    botaoRemover.style.width = '2px';
    botaoRemover.style.padding = '';
    botaoRemover.onclick = () => linha.remove();

    // Junta tudo
    linha.appendChild(input);
    linha.appendChild(botaoRemover);
    listaOpcoes.appendChild(linha);
}

//Função para listar as perguntas, faz a requisição no banco e cria uma tabela em html mostrando os resultados
async function listarPerguntas() {
    const perguntasSnap = await getDocs(collection(db, "perguntas")); // Recupera as perguntas
    perguntasSnap.forEach((doc) => { //percorre todas as perguntas
        const pergunta = doc.data();//Recupera os dados das perguntas
        console.log("Pergunta: ", pergunta.texto);
        document.getElementById("tabelaperguntas").innerHTML += `<tr>
            <td>${pergunta.texto}</td>
            <td>
                <button class="btn" onclick = "editarPergunta('${doc.id}')" >
                    Editar 
                </button>
                <button class="btn" onclick = "excluirPergunta('${doc.id}')" >
                    Excluir  
                </button>
            </td>
        </tr>`;
    });

}


//Função para adicionar perguntas, abre o modal e salva a pergunta no banco
function adicionarPergunta() {
    document.getElementById('formPergunta').addEventListener('submit', async function (e) {
        e.preventDefault();
        const pergunta = document.getElementById('perguntaTexto').value;
        const tipo = document.getElementById('tipoPergunta').value;

        console.log("Nova Pergunta:", pergunta, "Tipo:", tipo);
        fecharModalPergunta();
        // Aqui você pode chamar sua função de salvar no banco
        await addDoc(collection(db, "perguntas"), { // adiciona a pergunta no banco
            texto: pergunta,
            tipo: tipo,
            opcoes: Array.from(document.querySelectorAll('#listaOpcoes input')).map(input => input.value)
        }).then(() => {
            console.log("Pergunta salva com sucesso!");
            // Atualizar a tabela de perguntas
            location.reload();
        }).catch(error => {
            console.error("Erro ao salvar pergunta:", error);
        });
    });
}


//Fução para abrir o modal de receita
window.abrirModal = async function (fruta, receitaid) {
    console.log("Abrindo modal para editar receita:", receitaid, "da fruta:", fruta);
    document.getElementById('modalEditar').style.display = 'block';
    const receitaRef = doc(db, "receitas", fruta, "listadeReceitas", receitaid); //Recupera a receita
    const receitaSnap = await getDoc(receitaRef);
    if (receitaSnap.exists()) {
        const receita = receitaSnap.data(); // recupera os dados da receita


        document.getElementById("formReceitaEditar").innerHTML = `
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
        <button id="excluirReceita" type="submit">Excluir</button>

        `;

        document.getElementById("excluirReceita").addEventListener("click", async function (event) {
            event.preventDefault();
            await deleteDoc(receitaRef);
            console.log("Receita excluída com sucesso");
            // Atualiza a página para refletir a exclusão
            location.reload();

        });

        document.getElementById("salvarReceita").addEventListener("click", async function (event) {
            event.preventDefault();
            const titulo = document.getElementById("titulo").value;
            const descricao = document.getElementById("descricao").value;
            const mododepreparo = document.getElementById("mododepreparo").value;
            const ingredientes = document.getElementById("ingredientes").value;
            const imglink = document.getElementById("textImage").value;

            try { //Atualiza a receita no banco
                await updateDoc(receitaRef, {
                    titulo: titulo,
                    descricao: descricao,
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
};

//Função para listar as receitas, junto com botão de editar
async function listarReceitas() {
    const receitasSnap = await getDocs(collection(db, "receitas")); // Recupera todas as frutas que tem receitas

    for (const receitaid of receitasSnap.docs) {
        // Para cada fruta, recupera as receitas associadas
        const listadereceitasRef = collection(db, "receitas", receitaid.id, "listadeReceitas");
        const receitasSnap = await getDocs(listadereceitasRef);
        receitasSnap.forEach((doc) => { //Percorre cada receita da fruta
            const receita = doc.data();//Recupera os dados da receita
            //Mostra na tela atraves do html
            document.getElementById("cardsReceitas").innerHTML += `
        <div class="card">
        <img src="${receita.imagem}" alt="Imagem da Receita"
        class="card-image">
        <div class="card-title">${receita.titulo}</div>
        <div class="card-text">
        ${receita.descricao}
        </div>
        <button class="edit-button" onclick= "abrirModal('${receitaid.id}', '${doc.id}')" >Editar</button>
        </div>
        `;
        })
    }
}


// Coleta e filtra dados, gerando um relatório em HTML e PDF
// Função para gerar relatório de respostas de perguntas de múltipla escolha
// Função principal que será chamada para gerar o relatório
async function gerarRelatorio() {
    // Objeto para armazenar os dados coletados globalmente
    let dadosGlobais = {};
    const { jsPDF } = window.jspdf;

    async function coletarDadosComFiltro(turmaFiltro, idadeMin, tipoPerguntaFiltro) {
        const perguntasRef = collection(db, "perguntas"); 
        let perguntasQuery = perguntasRef;

        // Aplica filtro de tipo de pergunta
        if (tipoPerguntaFiltro !== "todas") {
            perguntasQuery = query(perguntasRef, where("tipo", "==", tipoPerguntaFiltro));
        }

        // Obtém todas as perguntas filtradas
        const perguntasSnap = await getDocs(perguntasQuery);
        const mapa = {};

        perguntasSnap.forEach(doc => {
            const data = doc.data();
            mapa[doc.id] = {
                texto: data.texto,
                tipo: data.tipo,
                opcoes: data.opcoes || [],
                contagem: data.tipo === "select" ? Object.fromEntries((data.opcoes || []).map(o => [o, 0])) : {},
                respostasTexto: [] // Armazena respostas escritas (texto)
            };
        });

        // Coleta todos os usuários
        const usuariosSnap = await getDocs(collection(db, "usuarios"));
        for (const userDoc of usuariosSnap.docs) {
            const user = userDoc.data();

            // Aplica filtros de turma e idade
            if ((turmaFiltro && user.turma !== turmaFiltro) ||
                (idadeMin && parseInt(user.idade) < parseInt(idadeMin))) continue;

            // Coleta respostas desse usuário
            const respostasSnap = await getDocs(collection(db, `usuarios/${userDoc.id}/respostas`));
            respostasSnap.forEach(respDoc => {
                const { perguntaId, resposta } = respDoc.data();
                const pergunta = mapa[perguntaId];

                if (!pergunta) return;

                // Para perguntas do tipo "select", adiciona na contagem
                if (pergunta.tipo === "select" && pergunta.contagem.hasOwnProperty(resposta)) {
                    pergunta.contagem[resposta]++;
                }
                // Para perguntas de texto, armazena o nome do usuário e resposta
                else if (pergunta.tipo === "texto") {
                    pergunta.respostasTexto.push({
                        nome: user.nome || "Anônimo",
                        resposta: resposta
                    });
                }
            });
        }

        return mapa; // Retorna o mapa com dados organizados
    }

    // Gera o relatório em HTML
    document.getElementById("btnGerarRelatorio").addEventListener("click", async function (event) {
        event.preventDefault();


        const filtroPergunta = document.getElementById("filtroPergunta").value;
        const turma = document.getElementById("filtroTurma").value.trim();
        const idade = document.getElementById("filtroIdade").value.trim();

        // Coleta os dados com os  filtros selecionados, se os filtros turma e idade não forem preenchidos, ele pega todos os dados
        const dados = await coletarDadosComFiltro(turma || null, idade || null, filtroPergunta);
        dadosGlobais = dados; // Armazena os dados globalmente

        // Limpa conteúdo anterior da div de relatório
        const relatorioDiv = document.getElementById("relatorioHTML");
        relatorioDiv.innerHTML = "";

        // Para cada pergunta coletada
        for (const [id, pergunta] of Object.entries(dados)) {
            const bloco = document.createElement("div");
            bloco.innerHTML = `<h3>${pergunta.texto}</h3>`;

            // Mostra contagem das respostas (select)
            if (pergunta.tipo === "select") {
                const total = Object.values(pergunta.contagem).reduce((a, b) => a + b, 0);
                const ul = document.createElement("ul");

                for (const [opcao, count] of Object.entries(pergunta.contagem)) {
                    if (count > 0) {
                        const porcentagem = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
                        const li = document.createElement("li");
                        li.textContent = `${opcao}: ${count} resposta(s) (${porcentagem}%)`;
                        ul.appendChild(li);
                    }
                }

                if (ul.children.length > 0) bloco.appendChild(ul);
            }

            // Mostra respostas de texto
            if (pergunta.tipo === "texto" && pergunta.respostasTexto.length > 0) {
                const lista = document.createElement("ul");
                pergunta.respostasTexto.forEach(r => {
                    const li = document.createElement("li");
                    li.textContent = `${r.nome}: ${r.resposta}`;
                    lista.appendChild(li);
                });
                bloco.appendChild(lista);
            }

            relatorioDiv.appendChild(bloco); // Adiciona o  bloco criado à div
        }
    });

    // Gerar PDF a partir dos dados globais que foram coletados
    document.getElementById("btnGerarPDF").addEventListener("click", function (event) {
        event.preventDefault();

        const doc = new jsPDF(); // Cria novo documento PDF
        let y = 20;
        let perguntaNum = 1;

        // Título do PDF
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Relatório de Respostas", 105, y, { align: "center" });

        y += 12;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0);

        // Para cada pergunta no relatório
        for (const [id, pergunta] of Object.entries(dadosGlobais)) {
            // Verifica se é necessário adicionar nova página
            if (y > 250) { doc.addPage(); y = 20; }

            // Adiciona título da pergunta com fundo
            doc.setFillColor(230, 230, 250); // cor lavanda
            doc.rect(15, y - 5, 180, 8, "F"); // fundo da pergunta
            doc.setFont("helvetica", "bold");
            doc.text(`${perguntaNum}. ${pergunta.texto}`, 20, y);

            y += 10;
            doc.setFont("helvetica", "normal");

            // Respostas do tipo "select"
            if (pergunta.tipo === "select") {
                const total = Object.values(pergunta.contagem).reduce((a, b) => a + b, 0);

                for (const [opcao, count] of Object.entries(pergunta.contagem)) {
                    if (count > 0) {
                        const porcentagem = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
                        const linha = `- ${opcao}: ${count} resposta(s) (${porcentagem}%)`;
                        doc.text(linha, 25, y);
                        y += 7;

                        if (y > 280) { doc.addPage(); y = 20; }
                    }
                }
            }
            // Respostas do tipo "texto"
            else if (pergunta.tipo === "texto" && pergunta.respostasTexto?.length > 0) {
                for (const r of pergunta.respostasTexto) {
                    const linha = `- ${r.nome || "Anônimo"}: ${r.resposta}`;
                    const splitText = doc.splitTextToSize(linha, 170); // Quebra de linha automática
                    doc.text(splitText, 25, y);
                    y += (splitText.length * 7);

                    if (y > 280) { doc.addPage(); y = 20; }
                }
            }

            y += 5;
            perguntaNum++;
        }

        doc.save("relatorio_respostas.pdf");
    });
}
//Função para adicionar receita
async function adicionarReceita() {
    const perguntaRef = await getDocs(collection(db, "receitas")); // Recupera todas as frutas que tem receitas
    document.getElementById("btnAdicionarReceita").addEventListener("click", function () {
        document.getElementById("modal").style.display = "block"; //Abre o modal para adicionar receita
        //as opcoes de frutas são recuperadas do banco de dados e mostradas no select
        document.getElementById("formReceita").innerHTML = `
            <label for="fruta">Fruta:</label><br>
            <select name="fruta" id="fruta" required>
                ${perguntaRef.docs.map(doc => `<option value="${doc.id}">${doc.id}</option>`).join('')} 
            </select>
            <label for="titulo">Título:</label><br>
            <input type="text" id="titulo" name="titulo" placeholder="titulo da receita" required>
            <br><br>
            <label for="descricao">Descrição:</label><br>
            <textarea id="descricao" name="descricao" rows="4" required></textarea><br>
            <label for="mododepreparo">Modo de preparo:</label><br>
            <textarea id="mododepreparo" name="mododepreparo" rows="4" required></textarea><br>
            <label for="ingredientes">Ingredientes:</label><br>
            <textarea id="ingredientes" name="ingredientes" rows="4" required></textarea>
            <br><br>
            <label for="image">Imagem:</label><br>
            <input type="text" id="textImage" name="textImage" placeholder="URL da imagem" required>
            <br><br>
            
            <button id="salvarReceita" type="submit">Salvar</button>`;
        document.getElementById("salvarReceita").addEventListener("click", async function (event) {
            event.preventDefault();

            const titulo = document.getElementById("titulo").value;
            const descricao = document.getElementById("descricao").value;
            const mododepreparo = document.getElementById("mododepreparo").value;
            const ingredientes = document.getElementById("ingredientes").value;
            const imglink = document.getElementById("textImage").value;
            const fruta = document.getElementById("fruta").value;

            const receitaDocRef = doc(db, "receitas", fruta, "listadeReceitas", titulo); // usa o título da receita como ID

            try {
                const docSnap = await getDoc(receitaDocRef);
                // Verifica se já existe uma receita com o mesmo título
                if (docSnap.exists()) {
                    alert("Já existe uma receita com esse título!");
                    return; // cancela o restante da execução
                }
                // Adiciona a receita no banco de dados, atraves do setDoc que pode sobreescrever o documento se ele já existir, ou personalizar o ID do documento
                await setDoc(receitaDocRef, {
                    titulo: titulo,
                    descricao: descricao,
                    preparo: mododepreparo,
                    ingredientes: ingredientes,
                    imagem: imglink
                });

                console.log("Documento adicionado com sucesso");
                location.reload();

            } catch (error) {
                console.error("Erro ao adicionar o documento", error);
            }


        }
        );
    }
    );
}


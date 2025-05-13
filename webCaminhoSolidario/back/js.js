function comecar(event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value;
    const turma = document.getElementById("turma").value;
    const idade = document.getElementById("idade").value;
    if (nome === "" || turma === "" || idade === "") {
        window.alert("Preencha todos os campos!");
        return;
    }
    localStorage.setItem("nome", nome);
    window.location.href = "./home.html";
   
}
function carregar() {
    const nome = localStorage.getItem("nome");
    if (nome) {
        const span = document.getElementById("nomeUsuario");
        if (span) {
            span.textContent = nome;
        }
    }else {
        window.location.href = "inicial.html";
        
    }
}
function sair(sair) {
    // Limpa o nome do usuário do localStorage
    localStorage.removeItem("nome");
    window.location.href = "TelaLogin.html";
}
function redquestinario(){
    window.location.href = "TelaQuestionario.html";
}
function voltar(){
    window.location.href = "./home.html";
}
function gerarperguntas(){
    const perguntas = [
        "Qual é a sua comida favorita?",
        "Qual fruta você mais gosta?",
        "Qual legume ou verdura você mais gosta?",
        "Qual comida você não gosta de jeito nenhum?",
        "Você gosta de experimentar alimentos novos?",
        "Você costuma tomar café da manhã todos os dias?",
        "Você costuma almoçar com a sua família?",
        "O que você costuma comer no lanche da escola?",
        "Você costuma comer frutas todos os dias?",
        "Você costuma comer verduras ou legumes no almoço ou jantar?",
        "Qual bebida você mais toma no dia a dia? (Ex: água, suco, refrigerante)",
        "Você costuma tomar água durante o dia?"
    ];

    for (let i = 0; i < 11; i++) {
        const pergunta = document.getElementById("perguntasquest");
        if (pergunta) {
            pergunta.textContent = perguntas[0];
        }
    }
}
function guardarrespostas(event){
    event.preventDefault();
    const resposta = document.getElementById("resposta").value;
    if (resposta === "") {
        window.alert("Preencha todos os campos!");
        return;
    }
    localStorage.setItem("resposta", resposta);
    window.alert(resposta);
}
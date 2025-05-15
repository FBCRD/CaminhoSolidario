import {initializeApp} from "../back/firebaseService.js";

import { getFirestore} from "../back/firebaseService.js";
import { firebaseConfig } from "../back/firebaseService.js";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

//Tela inicial
function entrar(){
    document.getElementById("formUsuario").addEventListener("submit", async function(event){
        event.preventDefault();
        const nome = document.getElementById("nome").value;
        const turma = document.getElementById("turma").value;
        const idade = document.getElementById("idade").value;
        //Fazer validação dos campos
        
        try{
            const usuario = await addDoc(collection(db, "usuarios"), {
                nome: nome,
                turma: turma,
                idade: idade
            });
            localStorage.setItem("nomeUsuario", usuario.nome);
            window.location.href = "/Telas/home.html";
        }catch (error) {
            console.error("Erro ao adicionar o documento: ", error);
        }
    });
}
//Tela de login admin
function logar(event){
    document.getElementById("formLogin").addEventListener("submit", async function(event){
        event.preventDefault();
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        const attlogin = document.getElementById("attlogin").value;
        //Fazer validação dos campos
        if (email !== "fabrodrigues@gmail.com" && senha !== "123") {
            attlogin.textContent = "Email ou senha incorretos!";
            return;
        }
        try{
            const usuario = await addDoc(collection(db, "usuarios"), {
                nome: nome,
                turma: turma,
                idade: idade
            });
            localStorage.setItem("nomeUsuario", usuario.nome);
            window.location.href = "/Telas/home.html";
        }catch (error) {
            console.error("Erro ao adicionar o documento: ", error);
        }
    });



}
//Home
function carregar() {
    // Verifica se o nome do usuário está armazenado no localStorage
    const nome = localStorage.getItem("nomeUsuario");
    if (nome) {
        const span = document.getElementById("nomeUsuario");
        if (span) {
            span.textContent = nome;
        }
    }else {
        window.location.href = "inicial.html";
        
    }

}
//Todas as telas
function sair() {
    // Limpa o nome do usuário do localStorage
    localStorage.removeItem("nomeUsuario");
    window.location.href = "Telainicial.html";
}
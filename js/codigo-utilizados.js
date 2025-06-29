async function adicionarSelect() {


    try {

        const docRef2 = doc(db, "perguntas", "pergunta2");
        await updateDoc(docRef, {
            opcoes: ["Maçã", "Banana", "Uva", "Laranja", "Morango", "Melancia", "Abacaxi", "Pera", "Mamão", "Manga",
                "Kiwi", "Limão", "Coco", "Ameixa", "Cereja", "Goiaba", "Caqui", "Figo", "Maracujá", "Pêssego",
                "Tangerina", "Abacate", "Framboesa", "Amora", "Graviola", "Jabuticaba"]
        }, { merge: true });

        const docRef = doc(db, "perguntas", "p03");
        await setDoc(docRef, {
            opcoes: ["Cenoura", "Tomate", "Alface", "Brócolis", "Pepino", "Batata", "Batata-doce", "Abóbora", "Chuchu",
                "Couve", "Espinafre", "Repolho", "Beterraba", "Vagem", "Ervilha", "Milho", "Quiabo", "Rabanete",
                "Berinjela", "Pimentão", "Abobrinha", "Cebola", "Alho", "Salsão", "Aipo", "Mandioquinha"]
        }, { merge: true });



        const docRef8 = doc(db, "perguntas", "p08");
        await setDoc(docRef, {
            opcoes: ["Fazer doces", "Fazer salgados"]
        }, { merge: true });


        const docRef9 = doc(db, "perguntas", "p09");
        await setDoc(docRef, {
            opcoes: ["Lanches", "Refeições", "Sobremesas"]
        }, { merge: true });

        // db.collection("perguntas").doc("p09").update({
        //     opcoes: [
        //         "Lanches", "Refeições", "Sobremesas"
        //     ]
        // })

        console.log("Opcoes adicionadas com sucesso")

    } catch (error) {
        console.log(error)
    }

}
adicionarSelect();
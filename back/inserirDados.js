import { writeBatch } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, query } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getDoc, doc, getDocs, where } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCbcrEzEclTnwYbikez1umD3AI8R1dG5Jc",
    authDomain: "caminhosolidario-49761.firebaseapp.com",
    projectId: "caminhosolidario-49761",
    storageBucket: "caminhosolidario-49761.firebasestorage.app",
    messagingSenderId: "370724267395",
    appId: "1:370724267395:web:a1e162926e5283836b82b6",
    measurementId: "G-CQT01YM1N5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa o Firestore (banco de dados)
const db = getFirestore(app);
const receitas = [
    {
        frutaUtilizada: "Maçã",
        titulo: "Torta de Maçã",
        ingredientes: "4 maçãs, 1 xícara de açúcar, 1 colher de canela, massa para torta.",
        preparo: "Descasque e corte as maçãs. Misture com açúcar e canela. Forre uma forma com massa, adicione o recheio e cubra. Asse por 40 min a 180°C.",
        imagem: "https://receitas.wap.ind.br/wp-content/uploads/2025/02/torta-de-maca-1080x640.jpg"
    },
    {
        frutaUtilizada: "Banana",
        titulo: "Bolo de Banana",
        ingredientes: "4 bananas maduras, 2 ovos, 1 xícara de açúcar, 2 xícaras de farinha, 1/2 xícara de óleo, 1 colher de fermento.",
        preparo: "Amasse as bananas e misture com ovos, açúcar e óleo. Adicione farinha e fermento. Asse por 35 min a 180°C.",
        imagem: "https://receitatodahora.com.br/wp-content/uploads/2023/08/bolo-de-banana-caramelada-24-0811-1200x900.jpg"
    },
    {
        frutaUtilizada: "Uva",
        titulo: "Gelatina Natural de Uva",
        ingredientes: "2 xícaras de uvas, 1 colher de açúcar, 1 envelope de gelatina incolor.",
        preparo: "Bata as uvas com água, coe e misture com a gelatina preparada. Leve à geladeira até firmar.",
        imagem: "https://escolasdobem.com.br/wp-content/uploads/2017/06/vegan-grape-jelly-4.jpg"
    },
    {
        frutaUtilizada: "Laranja",
        titulo: "Bolo de Laranja",
        ingredientes: "3 ovos, 1 xícara de suco de laranja, 2 xícaras de farinha, 1 xícara de açúcar, 1/2 xícara de óleo, 1 colher de fermento.",
        preparo: "Bata ovos, óleo e suco. Adicione açúcar, farinha e fermento. Asse por 40 min a 180°C.",
        imagem: "https://static.itdg.com.br/images/640-440/6ad512da7842a03c4e0a96c97f6fb5fb/323851-original.jpg"
    },
    {
        frutaUtilizada: "Morango",
        titulo: "Vitamina de Morango",
        ingredientes: "1 xícara de morangos, 1 copo de leite, 1 colher de mel.",
        preparo: "Bata tudo no liquidificador. Sirva gelado.",
        imagem: "https://www.receitasnestle.com.br/sites/default/files/srh_recipes/0f82afa330da4066ac90145bce6774cf.jpg"
    },
    {
        frutaUtilizada: "Melancia",
        titulo: "Suco de Melancia com Hortelã",
        ingredientes: "3 fatias de melancia, folhas de hortelã, gelo.",
        preparo: "Bata melancia com hortelã e gelo. Sirva na hora.",
        imagem: "https://receitadaboa.com.br/wp-content/uploads/2024/08/Imagem-ilustratva-de-suco-de-melancia.webp"
    },
    {
        frutaUtilizada: "Abacaxi",
        titulo: "Doce de Abacaxi",
        ingredientes: "1 abacaxi picado, 1 xícara de açúcar, 3 cravos-da-índia.",
        preparo: "Cozinhe tudo até formar calda dourada. Sirva frio.",
        imagem: "https://s2-receitas.glbimg.com/u450XEmAlGqpYTpvsMJwDGW1rbA=/0x0:420x285/984x0/smart/filters:strip_icc()/s.glbimg.com/po/rc/media/2012/03/30/15/26/09/952/20071225_pudim_abacaxi_vovo.jpg"
    },
    {
        frutaUtilizada: "Pera",
        titulo: "Pera Assada com Mel e Canela",
        ingredientes: "2 peras, 2 colheres de mel, 1 colher de canela em pó, suco de meio limão.",
        preparo: "Corte as peras ao meio, retire as sementes, regue com limão, mel e canela. Asse por 20 minutos e sirva com nozes, sorvete ou puro.",
        imagem: "https://i.panelinha.com.br/i1/bk-4135-blog-ayu8509.webp"
    },
    {
        frutaUtilizada: "Mamão",
        titulo: "Creme de Mamão",
        ingredientes: "1 mamão pequeno, 1 pote de iogurte, 1 colher de mel.",
        preparo: "Bata tudo no liquidificador e leve à geladeira.",
        imagem: "https://www.receitasnestle.com.br/sites/default/files/srh_recipes/29bb5e60974d38f24e85049f10576e53.jpg"
    },
    {
        frutaUtilizada: "Manga",
        titulo: "Mousse de Manga",
        ingredientes: "2 mangas maduras, 1 lata de leite condensado, 1 caixa de creme de leite.",
        preparo: "Bata tudo e leve à geladeira por 2h.",
        imagem: "https://static.itdg.com.br/images/640-440/b3894ad70df6a690d08f8ce426a17f55/shutterstock-1884548329-1-1-.jpg"
    },
    {
        frutaUtilizada: "Kiwi",
        titulo: "Salada de Frutas com Kiwi",
        ingredientes: "2 kiwis, 1 maçã, 1 banana, suco de laranja.",
        preparo: "Corte tudo e regue com suco de laranja.",
        imagem: "https://saboreiaavida.nestle.pt/sites/default/files/styles/receita_card_620x560/public/2020-12/Salada_de_Frutas_Aromatica.png?h=fd38a500&itok=8hPEoG3n"
    },
    {
        frutaUtilizada: "Limão",
        titulo: "Mousse de Limão",
        ingredientes: "1 lata de leite condensado, 1 caixa de creme de leite, suco de 3 limões.",
        preparo: "Misture tudo e leve à geladeira.",
        imagem: "https://static.itdg.com.br/images/640-440/6316848e0a847c086931db672b45fcb7/shutterstock-1949230144-1-1-.jpg"
    },
    {
        frutaUtilizada: "Coco",
        titulo: "Cocada de Forno",
        ingredientes: "2 xícaras de coco ralado, 1 lata de leite condensado, 1 colher de manteiga.",
        preparo: "Misture tudo, leve ao forno até dourar.",
        imagem: "https://claudia.abril.com.br/wp-content/uploads/2020/02/receita-cocada-de-forno.jpg"
    },
    {
        frutaUtilizada: "Ameixa",
        titulo: "Doce de Ameixa",
        ingredientes: "2 xícaras de ameixa seca, 1 xícara de açúcar, 1/2 xícara de água.",
        preparo: "Cozinhe até formar uma calda espessa.",
        imagem: "https://www.cozinhatecnica.com/wp-content/uploads/2021/02/receita-de-calda-de-ameixa-500x500.jpg"
    },
    {
        frutaUtilizada: "Cereja",
        titulo: "Cheesecake com Cerejas",
        ingredientes: "Base de biscoito, creme de cream cheese, cobertura de cereja.",
        preparo: "Monte as camadas e leve à geladeira.",
        imagem: "https://chefcristinahaaland.com.br/wp-content/uploads/2021/02/chef-cristina-haaland-Cheesecake-de-cerejas-600x600.jpg"
    },
    {
        frutaUtilizada: "Goiaba",
        titulo: "Doce de Goiaba",
        ingredientes: "1 kg de goiabas, 500g de açúcar.",
        preparo: "Cozinhe até formar um doce firme.",
        imagem: "https://static.itdg.com.br/images/1200-675/f672a6f3d8761b8fc362ded579aab143/354792-original.jpg"
    },
    {
        frutaUtilizada: "Caqui",
        titulo: "Vitamina de Caqui",
        ingredientes: "2 caquis, 1 copo de leite, 1 colher de açúcar.",
        preparo: "Bata tudo no liquidificador.",
        imagem: "https://receitanatureba.com/wp-content/uploads/2019/05/CAPA-3.jpg"
    },
    {
        frutaUtilizada: "Figo",
        titulo: "Figos em Calda",
        ingredientes: "10 figos, 1 xícara de açúcar, 1 pau de canela.",
        preparo: "Cozinhe até formar uma calda.",
        imagem: "https://static.itdg.com.br/images/1200-675/53050e85299f6f1f9da22ef280a158ff/21227-original.jpg"
    },
    {
        frutaUtilizada: "Maracujá",
        titulo: "Mousse de Maracujá",
        ingredientes: "1 lata de leite condensado, 1 caixa de creme de leite, suco de 2 maracujás.",
        preparo: "Misture tudo e leve à geladeira por 3h.",
        imagem: "https://static.itdg.com.br/images/1200-675/8231acb174ba2e6a4b4a61145e48eea7/249008-shutterstock-1907121220.jpg"
    },
    {
        frutaUtilizada: "Pêssego",
        titulo: "Compota de Pêssego",
        ingredientes: "6 pêssegos, 1 xícara de açúcar, 1 xícara de água.",
        preparo: "Cozinhe os pêssegos até a calda engrossar.",
        imagem: "https://claudia.abril.com.br/wp-content/uploads/2020/02/compota-de-pc3aassego.jpg?quality=70&strip=info&w=1024"
    },
    {
        frutaUtilizada: "Tangerina",
        titulo: "Suco de Tangerina com Gengibre",
        ingredientes: "4 tangerinas, gengibre ralado, gelo.",
        preparo: "Bata tudo e sirva gelado.",
        imagem: "https://villalvafrutas.com.br/wp-content/uploads/2020/02/Suco-870x500.webp"
    },
    {
        frutaUtilizada: "Abacate",
        titulo: "Creme de Abacate",
        ingredientes: "1 abacate, 1 colher de açúcar, gotas de limão.",
        preparo: "Amasse tudo e sirva gelado.",
        imagem: "https://static.itdg.com.br/images/1200-630/e1bd0ecfa29b6120f3b6993725ac2f5f/creme-de-abacate.jpg"
    },
    {
        frutaUtilizada: "Framboesa",
        titulo: "Smoothie de Framboesa",
        ingredientes: "1 xícara de framboesas, 1 banana, 1 copo de iogurte.",
        preparo: "Bata tudo no liquidificador.",
        imagem: "https://s2-receitas.glbimg.com/cD-Eg_CV2v9SBUG9lN_JYThPSjQ=/0x0:480x409/984x0/smart/filters:strip_icc()/s.glbimg.com/po/rc/media/2015/02/14/00_48_09_911_sucos_detox_gostosos_receita_1.jpg"
    },
    {
        frutaUtilizada: "Amora",
        titulo: "Geleia de Amora",
        ingredientes: "2 xícaras de amoras, 1 xícara de açúcar, suco de limão.",
        preparo: "Cozinhe até formar uma geleia.",
        imagem: "https://s2-receitas.glbimg.com/4EIigoKga5hhDSiqDVXe3fTZqJI=/0x0:1200x675/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2024/d/T/gzcexKSvC3Asl0i0ahPw/geleia-de-amora.jpg"
    },
    {
        frutaUtilizada: "Graviola",
        titulo: "Suco de Graviola",
        ingredientes: "Polpa de graviola, água, açúcar a gosto.",
        preparo: "Bata tudo e sirva gelado.",
        imagem: "https://guiadacozinha.com.br/wp-content/uploads/2023/06/Suco-de-graviola.jpg"
    },
    {
        frutaUtilizada: "Jabuticaba",
        titulo: "Geleia de Jabuticaba",
        ingredientes: "1 kg de jabuticabas, 500g de açúcar, suco de 1 limão.",
        preparo: "Cozinhe jabuticabas amassadas, coe, adicione açúcar e limão, e ferva até virar uma geleia consistente.",
        imagem: "https://i.panelinha.com.br/i1/bk-6334-receita-geleia-jabuticaba.webp"
    }
];

async function inserirReceitas() {
    const batch = writeBatch(db);

    receitas.forEach(receita => {
        const docRef = doc(collection(db, "receitas"), receita.frutaUtilizada);
        batch.set(docRef, receita);

    });
    await batch.commit();
    console.log("Receitas inseridas com sucesso!");
}
inserirReceitas();

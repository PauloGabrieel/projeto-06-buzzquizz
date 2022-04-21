let todosQuizz = [];
const API = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";

function criarQuizz() {
  document.querySelector('.tela1').classList.add('escondido')
  document.querySelector('.tela3').classList.remove('escondido')
  document.querySelector('.telacomecePeloComeco').classList.toggle('escondido')
}

function removerQuizz(elemento) {
  elemento.remove()
  verificarSeusQuizzes()
}
function verificarSeusQuizzes() {
  const tamanho = document
    .querySelector('.containerQuizz')
    .querySelectorAll('img').length
  if (tamanho === 0) {
    document.querySelector('.seusQuizz').classList.toggle('escondido')
    document.querySelector('.semQuizz').classList.toggle('escondido')
  }
}
function prosseguir(elemento) {
  const botoes = document.querySelectorAll('.botaoProsseguir')
  if (elemento === botoes[2]) {
    document.querySelector('.telaDecidaNiveis').classList.toggle('escondido')
    document.querySelector('.tela3').classList.toggle('escondido')
    document.querySelector('.tela1').classList.toggle('escondido')
    document.querySelector('.tela1').scrollIntoView(true)
  } else {
    for (let i = 0; i < botoes.length - 1; i++) {
      if (elemento === botoes[i]) {
        botoes[i].parentNode.classList.toggle('escondido')
        botoes[i + 1].parentNode.classList.toggle('escondido')
        botoes[i + 1].parentNode.scrollIntoView()
        return
      }
    }
  }
}

function pegarQuizz() {
  const promise = axios.get(API);
  promise.then(renderizarTodosQuizz)
  promise.catch(tratarErro);
}
function renderizarTodosQuizz(response){
  const containerQuizz = document.querySelector('.todosQuizz .containerQuizz');
  todosQuizz = response.data
  containerQuizz.innerHTML = "";
  function incluirQuizz(quiz){
    containerQuizz.innerHTML += `
      <div class="containerImagem" onclick="selecionarQuizz(this)">
        <div class="fundoDegrader"></div>
        <img src=${quiz.image} alt=""/>
        <p>${quiz.title}</p>
      </div>
    
    `
  };
  todosQuizz.map(incluirQuizz);
};

function tratarErro(erro){

}
function selecionarQuizz(elemento){
  const mainContainer = document.querySelector('.mainContainer').classList.toggle('escondido');
  console.log(mainContainer);
  console.log(elemento)
  
  


}
pegarQuizz()
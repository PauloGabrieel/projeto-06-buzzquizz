let todosQuizz = []
let quizzSelecionado = {}
let seuQuizz = {}
const API = 'https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes'

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
let quantidadePerguntas = 0
let quantidadeNivel = 0
function prosseguir(elemento) {
  if (elemento === botoes[0]) {
    // if (titulo.length < 20 || titulo.length > 65) {
    //   alert('preencha os dados corretamente')
    //   return
    // }
    // if (perguntas < 3) {
    //   alert('preencha os dados corretamente')
    //   return
    // }
    // if (niveis < 2) {
    //   alert('preencha os dados corretamente')
    //   return
    // }
    // if (url.slice(0, 8) !== 'https://') {
    //   alert('preencha os dados corretamente')
    //   return
    // }
    const botoes = document.querySelectorAll('.botaoProsseguir')
    const titulo = elemento.parentNode.querySelectorAll('input')[0].value
    const url = elemento.parentNode.querySelectorAll('input')[1].value
    quantidadePerguntas = elemento.parentNode.querySelectorAll('input')[2].value
    quantidadeNivel = elemento.parentNode.querySelectorAll('input')[3].value
  }
  seuQuizz.title = titulo
  seuQuizz.image = url
  renderizarPerguntas(quantidadePerguntas)
  renderizarNiveis(quantidadeNivel)
  if (elemento === botoes[botoes.length - 1]) {
    if (elemento === botoes[1]) {
      if (verificarPerguntas(elemento) === true) {
        return
      }
    }
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




function verificarPerguntas(elemento) {
  let perguntas = []
  let tituloPergunta = elemento.parentNode.querySelectorAll('input')[0]
  let corDeFundoPergunta = elemento.parentNode.querySelectorAll('input')[1]
  for (let i = 0; i < quantidadePergunta; i++) {
    for (let j = 0; j < 10 * quantidadePergunta; j++) {
      let pergunta = {}
      if (j === 0) {
        if (
          elemento.parentNode.querySelectorAll('input')[0 + i * 10].value
            .length < 20
        ) {
          alert('preencha os dados corretamente')
          return true
        }
      }
      if (j === 1) {
        if (
          elemento.parentNode
            .querySelectorAll('input')
            [1 + i * 10].value.slice(0, 1) !== '#' ||
          elemento.parentNode.querySelectorAll('input')[1 + i * 10].value
            .length !== 7
        ) {
          alert('preencha os dados corretamente')
          return true
        }
      }
      if (j === 2 || j === 3) {
        if (
          elemento.parentNode
            .querySelectorAll('input')
            [j + i * 10].value.trim() === ''
        ) {
          alert('preencha os dados corretamente')
          return true
        }
      }
    }
  }
}
function renderizarPerguntas(num) {
  console.log('entrou no renderizar nivel')
  let local = document.querySelector('.perguntas')
  local.innerHTML = ''
  for (let i = 1; i <= num; i++) {
    local.innerHTML += `
    <li class = "ocultarPergunta">
      <div class="pergunta">
        <div class="between">
          <h6>Pergunta ${i}</h6>
          <img
            src="./assets/images/Vector.png"
            style="width: 26px"
            style="height: 23px"
            onclick="proximaPergunta(this)"
            alt=""
          />
        </div>
        <input type="text" placeholder="Texto da pergunta" />
        <input type="text" placeholder="Cor de fundo da pergunta" />
        <h6>Resposta correta</h6>
        <input type="text" placeholder="Resposta correta" />
        <input type="url" placeholder="URL da imagem" />
        <h6>Respostas incorretas</h6>
        <input type="text" placeholder="Resposta incorreta 1" />
        <input type="url" placeholder="URL da imagem 1" />
        <input type="text" placeholder="Resposta incorreta 2" />
        <input type="url" placeholder="URL da imagem 2" />
        <input type="text" placeholder="Resposta incorreta 3" />
        <input type="url" placeholder="URL da imagem 3" />
      </div>
    </li>
   `
  }
}
function proximaPergunta(elemento) {
  const pai = elemento.parentNode.parentNode.parentNode.parentNode
  const li = elemento.parentNode.parentNode.parentNode
  if (pai.querySelector('.perguntaSelecionada') === null) {
    li.classList.toggle('perguntaSelecionada')
    li.classList.toggle('ocultarPergunta')
  } else {
    pai
      .querySelector('.perguntaSelecionada')
      .classList.toggle('ocultarPergunta')
    pai
      .querySelector('.perguntaSelecionada')
      .classList.toggle('perguntaSelecionada')
    li.classList.toggle('perguntaSelecionada')
    li.classList.toggle('ocultarPergunta')
  }
  // const arrayPerguntas = document
  //   .querySelector('.perguntas')
  //   .querySelectorAll('li')
  // for (let i = 0; i < arrayPerguntas; i++) {
  //   if (li === arrayPerguntas[0]) {
  //     pai.scrollIntoView()
  //   }
  //   if (li === arrayPerguntas[i]) {
  //     arrayPerguntas[i - 1].scrollIntoView()
  //   }
  // }
}
function renderizarNiveis(num) {
  const localizar = document.querySelector('.niveis')
  localizar.innerHTML = ''
  for (let i = 1; i <= num; i++) {
    localizar.innerHTML += `
    <li>
      <div class="nivel">
        <div class="between" style="width: 100%">
          <h6>Nivel ${i}</h6>
          <img
          src="./assets/images/Vector.png"
          style="width: 26px"
          style="height: 23px"
          onclick="proximaPergunta(this)"
          alt=""
          />
        </div>
          <input type="text" placeholder="Título do nível" />
          <input type="text" placeholder="% de acerto mínima" />
          <input type="url" placeholder="URL da imagem do nível" />
          <input
          class="descricao"
          type="text"
          placeholder="Descrição do nível"
          />
        </div>
    </li>
    `
  }
}

function pegarQuizz() {
  const promise = axios.get(API)
  promise.then(carregarTodosQuizz)
  promise.catch(tratarErro)
}
function carregarTodosQuizz(response) {
  todosQuizz = response.data;
  renderizarTodosQuizzes();
}
function renderizarTodosQuizzes(){
  const containerQuizz = document.querySelector('.todosQuizz .containerQuizz');
  containerQuizz.innerHTML = ''
  for(let i = 0; i< todosQuizz.length; i++){  

    containerQuizz.innerHTML += `
      <div class="containerImagem" onclick="selecionarQuizz(this)">
        <div class="fundoDegrader"></div>
        <img data-id="${todosQuizz[i].id}" src=${todosQuizz[i].image} alt=""/>
        <p>${todosQuizz[i].title}</p>
      </div>
    
    `
  }
  
  
}
function tratarErro(erro) {

}

function selecionarQuizz(elemento){
  const mainContainer = document.querySelector('.mainContainer').classList.toggle('escondido');
  const quizzTitle = document.querySelector('.quizztitle').classList.toggle('escondido');
  const tela2 = document.querySelector('.tela2').classList.toggle('escondido');
  const id = elemento.querySelector("img")
  const dataId = id.getAttribute("data-id")
  const promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${dataId}`);
  
  
  promise.then(function(response){
    quizzSelecionado = response.data;
    renderizarQuizzSelecionado(quizzSelecionado);

  })
  promise.catch(erroSelecionarQuizz);
}



function renderizarQuizzSelecionado(quizzSelecionado){
  const quizzTitle = document.querySelector(".quizztitle");
  const title = document.querySelector(".quizztitle p");
  const tela2 = document.querySelector('.tela2');
  const perguntasDosQuizz = document.querySelector(".perguntasDoQuizz")
  const perguntas = quizzSelecionado.questions
  
  quizzTitle.style.backgroundImage = `url(${quizzSelecionado.image})`
  title.innerHTML = `${quizzSelecionado.title}`
  
  
  for( let i = 0; i < perguntas.length; i++ ){
    const respostas = perguntas[i].answers;
    
    respostas.sort(embaralharRespostas)
    
    tela2.innerHTML += `
      <div class="perguntasDoQuizz">
        <div class="perguntaDoQuizz" style="background-color:${perguntas[i].color}">
          <p>${perguntas[i].title}</p>
        </div>
        <div class="opcoesDeRespostas">
            
        </div>   
      </div>
    
    `
    const opcoesDeRespostas = document.querySelectorAll(".opcoesDeRespostas")
    for(let z = 0; z < respostas.length; z ++){
      opcoesDeRespostas[i].innerHTML +=`
      <div class="opcao" onclick="respostaEscolhida(this)">
        <img src=${respostas[z].image} alt="">
        <p>${respostas[z].text}</p>
      </div>
      
      `

    }
  }
 
}
function erroSelecionarQuizz(error){
  console.log(erro.response)
}
  
function embaralharRespostas(){
  return Math.random() - 0.5;
}

function respostaEscolhida(elemento){
  
  
  // for(let i = 0; i < perguntas.length; i++){
  //   if()
  // }
}

pegarQuizz()
let todosQuizz = []
let seusQuizzes = []
let quizzSelecionado = {}
let seuQuizz = {}
const API = 'https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes'
pegarQuizzDoNavegador()
if (seusQuizzes.length !== 0) {
  renderizarSeusQuizzes()
}
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
    .querySelectorAll('.containerImagem').length
  if (tamanho === 0) {
    document.querySelector('.seusQuizz').classList.toggle('escondido')
    document.querySelector('.semQuizz').classList.toggle('escondido')
    return
  } else if (tamanho === 1) {
    document.querySelector('.seusQuizz').classList.remove('escondido')
    document.querySelector('.semQuizz').classList.add('escondido')
  }
}
let quantidadePerguntas = 0
let quantidadeNivel = 0
function prosseguir(elemento) {
  const botoes = document.querySelectorAll('.botaoProsseguir')
  const inputRespostas = botoes[1].parentNode.querySelectorAll('input')
  const inputNiveis = botoes[2].parentNode.querySelectorAll('input')
  if (elemento === botoes[0]) {
    const titulo = elemento.parentNode.querySelectorAll('input')[0].value
    const url = elemento.parentNode.querySelectorAll('input')[1].value
    quantidadePerguntas = elemento.parentNode.querySelectorAll('input')[2].value
    quantidadeNivel = elemento.parentNode.querySelectorAll('input')[3].value
    seuQuizz.title = titulo
    seuQuizz.image = url
    if (titulo.length < 20 || titulo.length > 65) {
      alert('preencha os dados corretamente')
      return
    }
    if (quantidadePerguntas < 3) {
      alert('preencha os dados corretamente')
      return
    }
    if (quantidadeNivel < 2) {
      alert('preencha os dados corretamente')
      return
    }
    if (url.slice(0, 8) !== 'https://') {
      alert('preencha os dados corretamente')
      return
    }
    renderizarPerguntas(quantidadePerguntas)
    renderizarNiveis(quantidadeNivel)
  }
  if (elemento === botoes[1]) {
    // if (verificarPerguntas(elemento) === true) {
    //   return
    // }
    let perguntas = []
    let respostas = []
    for (let i = 0; i < quantidadePerguntas; i++) {
      let pergunta = {}
      let resposta = {}
      pergunta.title = inputRespostas[0 + 10 * i].value
      pergunta.color = inputRespostas[1 + 10 * i].value
      resposta.text = inputRespostas[2 + 10 * i].value
      resposta.image = inputRespostas[3 + 10 * i].value
      resposta.isCorrectAnswer = true
      respostas.push(resposta)
      resposta = {}
      resposta.text = inputRespostas[4 + 10 * i].value
      resposta.image = inputRespostas[5 + 10 * i].value
      resposta.isCorrectAnswer = false
      respostas.push(resposta)
      resposta = {}
      resposta.text = inputRespostas[6 + 10 * i].value
      resposta.image = inputRespostas[7 + 10 * i].value
      resposta.isCorrectAnswer = false
      respostas.push(resposta)
      resposta.text = inputRespostas[8 + 10 * i].value
      resposta.image = inputRespostas[9 + 10 * i].value
      resposta.isCorrectAnswer = false
      respostas.push(resposta)
      resposta = {}
      pergunta.answers = respostas
      respostas = []
      perguntas.push(pergunta)
    }
    seuQuizz.questions = perguntas
  }
  if (elemento === botoes[2]) {
    if (verificarNiveis() === true) {
      return
    }
    let niveis = []
    for (let i = 0; i < quantidadeNivel; i++) {
      let nivel = {}
      nivel.title = inputNiveis[0 + i * 4].value
      nivel.image = inputNiveis[1 + i * 4].value
      nivel.text = inputNiveis[2 + i * 4].value
      nivel.minValue = inputNiveis[3 + i * 4].value
      niveis.push(nivel)
    }
    seuQuizz.levels = niveis
  }
  // if (elemento === botoes[botoes.length - 1]) {
  //   seusQuizzes.push(seuQuizz)
  //   renderizarSeusQuizzes()
  //   document.querySelector('.telaQuizzPronto').classList.toggle('escondido')
  //   document.querySelector('.tela3').classList.toggle('escondido')
  //   document.querySelector('.tela1').classList.toggle('escondido')
  //   document.querySelector('.tela1').scrollIntoView(true)
  // } else {
  for (let i = 0; i < botoes.length - 1; i++) {
    if (elemento === botoes[i]) {
      botoes[i].parentNode.classList.toggle('escondido')
      botoes[i + 1].parentNode.classList.toggle('escondido')
      botoes[i + 1].parentNode.scrollIntoView()
      return
    }
  }
  if (elemento === botoes[botoes.length - 1]) {
    for (let i = 0; i < seuQuizz.questions.length; i++) {
      seuQuizz.questions[i].answers = seuQuizz.questions[i].answers.filter(
        function (elemento) {
          if (elemento.image.trim() === '') {
            return false
          }
          return true
        }
      )
    }
    seusQuizzes.push(seuQuizz)
    mandarQuizzParaNavegador()
    renderizarSeusQuizzes()
    verificarSeusQuizzes()
    elemento.parentNode.classList.toggle('escondido')
    document.querySelector('.telaQuizzPronto').classList.toggle('escondido')
    let localizar = document.querySelector('.quizzNovo')
    localizar.innerHTML = `
      <div class="containerImagem">
        <div class="fundoDegrader"></div>
        <img
        src="${seuQuizz.image}"
        alt=""
        />
        <p>
          ${seuQuizz.title}
        </p>
      </div>
    `
  }
  seuQuizz = {}
  for (let i = 0; i < 4; i++) {
    document.querySelectorAll('input')[i].value = ''
  }
}

function verificarPerguntas(elemento) {
  let perguntasErradasVazias = 0
  const input = elemento.parentNode.querySelectorAll('input')
  // let perguntas = []
  // let tituloPergunta = elemento.parentNode.querySelectorAll('input')[0]
  // let corDeFundoPergunta = elemento.parentNode.querySelectorAll('input')[1]
  for (let i = 0; i < quantidadePerguntas; i++) {
    for (let j = 0; j < 10; j++) {
      // let pergunta = {}
      if (j === 0) {
        if (input[0 + i * 10].value.length < 20) {
          alert('preencha os dados corretamente')
          return true
        }
      }
      if (j === 1) {
        if (
          input[1 + i * 10].value.slice(0, 1) !== '#' ||
          input[1 + i * 10].value.length !== 7
        ) {
          alert('preencha os dados corretamente')
          return true
        }
      }
      if (j === 2 || j === 3) {
        if (input[j + i * 10].value.trim() === '') {
          alert('preencha os dados corretamente')
          return true
        }
      }
      if (j === 3 || j === 5 || j === 7 || j === 9) {
        if (input[j + i * 10].value.slice(0, 8) !== 'https://') {
          if (input[j + i * 10].value.trim() === '') {
            return false
          }
          return true
        }
      }
      if (
        input[4 + i * 10].value.trim() === '' &&
        input[5 + i * 10].value.trim() === '' &&
        input[6 + i * 10].value.trim() === '' &&
        input[7 + i * 10].value.trim() === '' &&
        input[8 + i * 10].value.trim() === '' &&
        input[9 + i * 10].value.trim() === ''
      ) {
        alert('preencha os dados corretamente')
        return true
      }
      if (j === 4 || j === 6 || j === 8) {
        if (
          elemento.parentNode
            .querySelectorAll('input')
            [j + i * 10].value.trim() === '' &&
          elemento.parentNode
            .querySelectorAll('input')
            [j + 1 + i * 10].value.trim() === ''
        ) {
          perguntasErradasVazias++
        }
      }
    }
  }
  if (perguntasErradasVazias > 2 * quantidadePerguntas) {
    alert('preencha os dados corretamente')
    console.log(perguntasErradasVazias)
    return true
  }
}
function verificarNiveis() {
  const input = document.querySelector('.niveis').querySelectorAll('input')
  for (let i = 0; i < quantidadeNivel; i++) {
    for (j = 0; j < 4; j++) {
      if (j === 0) {
        if (input[0 + 4 * i].value.length < 10) {
          alert('Preencha os dados corretamente')
          return true
        }
      }
      if (j === 1) {
        if (input[1 + 4 * i].value < 0 || input[1 + 4 * i].value > 100) {
          alert('Preencha os dados corretamente')
          return true
        }
      }
      if (j === 2) {
        if (input[2 + 4 * i].value.slice(0, 8) !== 'https://') {
          alert('Preencha os dados corretamente')
          return true
        }
      }
      if (j === 3) {
        if (input[3 + 4 * i].value.length < 30) {
          alert('Preencha os dados corretamente')
          return true
        }
      }
    }
  }
  let contador = 0
  for (let i = 0; i < quantidadeNivel; i++) {
    if (input[1 + 4 * i].value == 0) {
      contador++
    }
  }
  if (contador === 0) {
    alert('Preencha os dados corretamente')
    return true
  }
}
function renderizarPerguntas(num) {
  let local = document.querySelector('.perguntas')
  local.innerHTML = ''
  for (let i = 1; i <= num; i++) {
    local.innerHTML += `
    <li>
      <div class="pergunta ocultarPergunta">
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
  const pergunta = elemento.parentNode.parentNode
  const li = pai.querySelectorAll('li')
  if (pai.querySelector('.perguntaSelecionada') === null) {
    pergunta.classList.toggle('perguntaSelecionada')
    pergunta.classList.toggle('ocultarPergunta')
  } else {
    pai
      .querySelector('.perguntaSelecionada')
      .classList.toggle('ocultarPergunta')
    pai
      .querySelector('.perguntaSelecionada')
      .classList.toggle('perguntaSelecionada')
    pergunta.classList.toggle('perguntaSelecionada')
    pergunta.classList.toggle('ocultarPergunta')
  }
  for (let i = 0; i < li.length; i++) {
    if (elemento.parentNode.parentNode.parentNode === li[0]) {
      pai.parentNode.querySelector('h4').scrollIntoView({ behavior: 'smooth' })
    } else if (elemento.parentNode.parentNode.parentNode === li[i]) {
      li[i - 1].scrollIntoView({ behavior: 'smooth' })
    }
  }
}
function renderizarNiveis(num) {
  const localizar = document.querySelector('.niveis')
  localizar.innerHTML = ''
  for (let i = 1; i <= num; i++) {
    localizar.innerHTML += `
    <li>
      <div class="nivel ocultarPergunta">
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
function renderizarSeusQuizzes() {
  console.log(seusQuizzes)
  const localizar = document.querySelector('.containerQuizz')
  localizar.innerHTML = ''
  for (let i = 0; i < seusQuizzes.length; i++) {
    localizar.innerHTML += `
  <div class="containerImagem" onclick="funcaoASerImplementada(this)">
  <div class="fundoDegrader"></div>
  <img
    src="${seusQuizzes[i].image}"
    alt=""
    onclick="selecionarQuizz(this)"
  />
  <p>
    ${seusQuizzes[i].title}
  </p>
</div>
  `
  }
  verificarSeusQuizzes()
}
function voltarHome() {
  document.querySelector('.telaQuizzPronto').classList.toggle('escondido')
  document.querySelector('.tela3').classList.toggle('escondido')
  document.querySelector('.tela1').classList.toggle('escondido')
}

function pegarQuizz() {
  const promise = axios.get(API)
  promise.then(carregarTodosQuizz)
  promise.catch(tratarErro)
}
function carregarTodosQuizz(response) {
  todosQuizz = response.data
  renderizarTodosQuizzes()
}
function renderizarTodosQuizzes() {
  const containerQuizz = document.querySelector('.todosQuizz .containerQuizz')
  containerQuizz.innerHTML = ''
  for (let i = 0; i < todosQuizz.length; i++) {
    containerQuizz.innerHTML += `
      <div class="containerImagem" onclick="selecionarQuizz(this)">
        <div class="fundoDegrader"></div>
        <img data-id="${todosQuizz[i].id}" src=${todosQuizz[i].image} alt=""/>
        <p>${todosQuizz[i].title}</p>
      </div>
    
    `
  }
}
function tratarErro(erro) {}

function selecionarQuizz(elemento) {
  const mainContainer = document
    .querySelector('.mainContainer')
    .classList.toggle('escondido')
  const quizzTitle = document
    .querySelector('.quizztitle')
    .classList.toggle('escondido')
  const tela2 = document.querySelector('.tela2').classList.toggle('escondido')
  const id = elemento.querySelector('img')
  const dataId = id.getAttribute('data-id')
  const promise = axios.get(
    `https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${dataId}`
  )

  promise.then(function (response) {
    quizzSelecionado = response.data
    renderizarQuizzSelecionado(quizzSelecionado)
  })
  promise.catch(erroSelecionarQuizz)
}

function renderizarQuizzSelecionado(quizzSelecionado) {
  const quizzTitle = document.querySelector('.quizztitle')
  const title = document.querySelector('.quizztitle p')
  const tela2 = document.querySelector('.tela2')
  const perguntasDosQuizz = document.querySelector('.perguntasDoQuizz')
  const perguntas = quizzSelecionado.questions

  quizzTitle.style.backgroundImage = `url(${quizzSelecionado.image})`
  title.innerHTML = `${quizzSelecionado.title}`

  for (let i = 0; i < perguntas.length; i++) {
    const respostas = perguntas[i].answers

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
    const opcoesDeRespostas = document.querySelectorAll('.opcoesDeRespostas')
    for (let z = 0; z < respostas.length; z++) {
      opcoesDeRespostas[i].innerHTML += `
      <div class="opcao" onclick="respostaEscolhida(this)">
        <img src=${respostas[z].image} alt="">
        <p>${respostas[z].text}</p>
      </div>
      
      `
    }
  }
}
function erroSelecionarQuizz(error) {
  console.log(erro.response)
}

function embaralharRespostas() {
  return Math.random() - 0.5
}

function respostaEscolhida(elemento) {
  // for(let i = 0; i < perguntas.length; i++){
  //   if()
  // }
}

pegarQuizz()
function pegarQuizzDoNavegador() {
  const pegarQuizz = localStorage.getItem('seusQuizzes')
  if (pegarQuizz === null) {
    return
  }
  const dadosDeserializados = JSON.parse(pegarQuizz)
  seusQuizzes = dadosDeserializados
}
function mandarQuizzParaNavegador() {
  const dadosSerializados = JSON.stringify(seusQuizzes)
  localStorage.setItem('seusQuizzes', `${dadosSerializados}`)
}

let todosQuizz = []
let seusQuizzes = []
let quizzSelecionado = []
let seuQuizz = {}
let acertos = 0
let jogadas = 0
let levels = []

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
    if (verificarPerguntas(elemento) === true) {
      return
    }
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
      nivel.minValue = inputNiveis[1 + i * 4].value
      nivel.image = inputNiveis[2 + i * 4].value
      nivel.text = inputNiveis[3 + i * 4].value
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
    elemento.parentNode.classList.toggle('escondido')
    document.querySelector('.telaQuizzPronto').classList.toggle('escondido')
    document.querySelector('.telaQuizzPronto').scrollIntoView(false)
    let localizar = document.querySelector('.quizzNovo')
    localizar.innerHTML = `
    <div class="containerImagem">
      <div class="fundoDegrader"></div>
      <img
      src="${seuQuizz.image}"
      />
      <p>
        ${seuQuizz.title}
      </p>
    </div>
  `
    mandarQuizzServidor(seuQuizz)
    // seusQuizzes.push(seuQuizz)
    // mandarQuizzParaNavegador()
    // renderizarSeusQuizzes()
    // verificarSeusQuizzes()
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
          input[1 + i * 10].value.length !== 7 ||
          !verificaHexadecimal(input[1 + i * 10].value)
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
      if (j === 3) {
        if (input[3 + i * 10].value.slice(0, 8) !== 'https://') {
          alert('preencha os dados corretamente')
          return true
        }
      }
      if (j === 5 || j === 7 || j === 9) {
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
  const localizar = document.querySelector('.containerQuizz')
  localizar.innerHTML = ''
  for (let i = 0; i < seusQuizzes.length; i++) {
    localizar.innerHTML += `
  <div class="containerImagem" onclick="selecionarQuizz(this)">
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
  window.location.reload()
}

function pegarQuizz() {
  const promise = axios.get(API)
  promise.then(carregarTodosQuizz)
  promise.catch(tratarErro)
}

function carregarTodosQuizz(response) {
  response.data.map(function (elemento) {
    todosQuizz.push(elemento)
  })
  renderizarTodosQuizzes(todosQuizz)
}
function renderizarTodosQuizzes(todosQuizz) {
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
  // const dataId = id.getAttribute('data-id')
  // const promise = axios.get(
  //   `https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${dataId}`
  // )

  // promise.then(function (response) {
  //   quizzSelecionado = response.data
  //   renderizarQuizzSelecionado(quizzSelecionado)
  // })
  // promise.catch(function (erro) {
  //   console.log(erro.response)
  // })
  const dataId = elemento.querySelector('[data-id]').getAttribute('data-id')
  quizzSelecionado.push(
    todosQuizz.filter(function (elemento) {
      if (elemento.id == dataId) {
        return true
      }
      return false
    })
  )

  renderizarQuizzSelecionado(quizzSelecionado[0])
  
}

function renderizarQuizzSelecionado(quizzSelecionado) {
  window.scrollTo(0, 0)

  const quizzTitle = document.querySelector('.quizztitle')
  const title = document.querySelector('.quizztitle p')
  const tela2 = document.querySelector('.tela2')
  const perguntasDosQuizz = document.querySelector('.perguntasDoQuizz')
  const perguntas = quizzSelecionado[0].questions
  levels = quizzSelecionado[0].levels

  tela2.innerHTML = ""

  quizzTitle.style.backgroundImage = `url(${quizzSelecionado[0].image})`
  title.innerHTML = `${quizzSelecionado[0].title}`
  
  for (let i = 0; i < perguntas.length; i++) {
    const respostas = perguntas[i].answers

    respostas.sort(embaralharRespostas)

    tela2.innerHTML += `
      <div id="${i}"class="perguntasDoQuizz">
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
      <div class="opcao" data-isCorrect="${respostas[z].isCorrectAnswer}" onclick="respostaEscolhida(this,${perguntas.length})">
        <div class=""></div>
        <img src=${respostas[z].image} alt="">
        <p>${respostas[z].text}</p>
      </div>
      
      `
    }
  }
  tela2.innerHTML+=`<div class="resultadoQuizz escondido"></div>`
}

function embaralharRespostas() {
  return Math.random() - 0.5
}

function respostaEscolhida(elemento, qtdPerguntas) {
  const clicado = elemento.parentNode
  const opcoesDeRespostas = elemento.parentNode.querySelectorAll('.opcao')
  const pergunta = document.querySelectorAll(".perguntasDoQuizz")
  
  if (clicado.classList.contains('clicado') === false) {
    jogadas++
    if (elemento.getAttribute('data-isCorrect') === 'true') {
      acertos++
    }

    opcoesDeRespostas.forEach(opcao => {
      opcao.querySelector('div').classList.add('naoSelecionado')
      elemento.querySelector('div').classList.remove('naoSelecionado')

      if (opcao.getAttribute('data-isCorrect') === 'true') {
        opcao.querySelector('p').style.color = 'green'
      } else {
        opcao.querySelector('p').style.color = 'red'
      }
    })
  } else {
    return
  }
  setTimeout(function(){ pergunta[jogadas].scrollIntoView()}, 2000)
  
  clicado.classList.add('clicado')
  if (jogadas === qtdPerguntas) {

    fimDeJogo(acertos, qtdPerguntas, levels)
    
  }
}

function fimDeJogo(acertos, qtdPerguntas, levels) {
  // const tela2 = document.querySelector('.tela2')
  const resultadoQuizz = document.querySelector(".resultadoQuizz");
  resultadoQuizz.classList.remove('escondido')

  const porcentagem = Math.floor((acertos * 100) / qtdPerguntas)
  let verificarLevel = 0;
  let resultadoLevel = [];
  resultadoQuizz.innerHTML = `
  
      <div class="porcentagemAcerto">
          
      </div>
      <div class="resultado">
          
      </div>
      <div class="reiniciarQuizz" onclick="reiniciarQuizz()">
          Reiniciar Quizz
      </div>
      <div class="voltarHome" onclick="voltarHome()">Voltar pra home</div>
  

  `
  
  const faixaDelevel = levels.map(level => level.minValue) 
  faixaDelevel.sort((a,b)=> a - b)
  for(let i = 0; i < faixaDelevel.length; i++){
    if(porcentagem > faixaDelevel[faixaDelevel.length - 1]){
         verificarLevel = faixaDelevel[faixaDelevel.length-1]
        break
    }
    if (porcentagem == faixaDelevel[i]){
        verificarLevel = faixaDelevel[i]
        break
    }
    if (porcentagem <= faixaDelevel[i]){
        verificarLevel = faixaDelevel[i - 1]
  }
}
  
  function verificar(levels, verificarLevel){
    for(let i = 0; i < levels.length; i++){
      if(levels[i].minValue === verificarLevel){
        resultadoLevel.push(levels[i])
      }
    }
    
    console.log(levels)
    console.log(verificarLevel)
    
  }
  verificar(levels,verificarLevel)
  console.log(resultadoLevel)
  
  
  
  // const resultadoQuizz = document.querySelector(".resultadoQuizz");
  
  const renderizarTitulo = document.querySelector('.porcentagemAcerto')
  const renderizarImgEhTexto = document.querySelector(".resultadoQuizz .resultado")
  
  renderizarTitulo.innerHTML = `<p> ${porcentagem}% de acerto:${resultadoLevel[0].title}</p>`
  renderizarImgEhTexto.innerHTML = `
                                    <img src="${resultadoLevel[0].image}" alt="">
                                    <p>${resultadoLevel[0].text}</p>
  `
  
  
  
  setTimeout(function(){resultadoQuizz.scrollIntoView()}, 2000)
}

function reiniciarQuizz(){
  
  const opcoesDeRespostas = document.querySelectorAll('.opcoesDeRespostas')
  const resultado = document.querySelector('.resultadoQuizz')
  resultado.classList.add("escondido")

  opcoesDeRespostas.forEach(opcao =>{
    
    
   
    console.log(opcao)
    console.log(opcao.querySelectorAll('.naoSelecionado'))

    const naoSelecionado = opcao.querySelectorAll('.naoSelecionado')
    naoSelecionado.forEach(div =>{
      div.classList.remove('naoSelecionado')
    })
    
    let textos = opcao.querySelectorAll('p')
    textos.forEach(texto =>{
      texto.style.color = 'black'

    })

    opcao.classList.remove('clicado')
    
    
    
  })
  jogadas = 0;
  acertos = 0;
  
  renderizarQuizzSelecionado()
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
function mandarQuizzServidor(quizz) {
  const quizzMandadoServidor = axios.post(API, quizz)
  quizzMandadoServidor.then(function (response) {
    //armazeno o quizz
    //coloco o quizz no navegador
    // visualizacaoDoQuizzFinalizado(quizz)
    seuQuizz.id = response.data.id
    seuQuizz.key = response.data.key
    seusQuizzes.push(quizz)
    renderizarSeusQuizzes()
    mandarQuizzParaNavegador()
    seuQuizz = {}
    for (let i = 0; i < 4; i++) {
      document.querySelectorAll('input')[i].value = ''
    }
  })

  quizzMandadoServidor.catch(function () {})
}
// function visualizacaoDoQuizzFinalizado(quizz) {}
function verificaHexadecimal(hexadecimal) {
  let contador = 0
  const letrasParaVerificar = ['A', 'B', 'C', 'D', 'E', 'F']
  for (let i = 1; i < hexadecimal.length; i++) {
    for (let j = 0; j < letrasParaVerificar.length; j++) {
      if (
        hexadecimal.toUpperCase().slice(i, i + 1) === letrasParaVerificar[j]
      ) {
        contador++
        break
      }
    }
  }
  if (contador === 6) {
    return true
  }
  return false
}

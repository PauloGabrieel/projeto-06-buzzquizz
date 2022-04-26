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
  } else if (tamanho > 0) {
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
  const span = elemento.parentNode.querySelectorAll('span')
  if (elemento === botoes[0]) {
    const titulo = elemento.parentNode.querySelectorAll('input')[0]
    const url = elemento.parentNode.querySelectorAll('input')[1]
    quantidadePerguntas = elemento.parentNode.querySelectorAll('input')[2]
    quantidadeNivel = elemento.parentNode.querySelectorAll('input')[3]
    seuQuizz.title = titulo.value
    seuQuizz.image = url.value
    let erros = 0
    if (titulo.value.length < 20 || titulo.length > 65) {
      dadosErrados(titulo, span[0])
      erros++
    } else {
      verificaInput(titulo, span[0])
    }
    if (quantidadePerguntas.value < 3) {
      dadosErrados(quantidadePerguntas, span[2])
      erros++
    } else {
      verificaInput(quantidadePerguntas, span[2])
    }
    if (quantidadeNivel.value < 2) {
      dadosErrados(quantidadeNivel, span[3])
      erros++
    } else {
      verificaInput(quantidadeNivel, span[3])
    }
    if (url.value.slice(0, 8) !== 'https://') {
      dadosErrados(url, span[1])
      erros++
    } else {
      verificaInput(url, span[1])
    }
    if (erros > 0) {
      return
    }
    renderizarPerguntas(quantidadePerguntas.value)
    renderizarNiveis(quantidadeNivel.value)
  }
  if (elemento === botoes[1]) {
    if (verificarPerguntas(elemento) === true) {
      return
    }
    let perguntas = []
    let respostas = []
    for (let i = 0; i < quantidadePerguntas.value; i++) {
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
      resposta = {}
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
    for (let i = 0; i < quantidadeNivel.value; i++) {
      let nivel = {}
      nivel.title = inputNiveis[0 + i * 4].value
      nivel.minValue = inputNiveis[1 + i * 4].value
      nivel.image = inputNiveis[2 + i * 4].value
      nivel.text = inputNiveis[3 + i * 4].value
      niveis.push(nivel)
    }
    seuQuizz.levels = niveis
  }
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

    mandarQuizzServidor(seuQuizz)
  }
}

function verificarPerguntas(elemento) {
  // let perguntasErradasVazias = 0
  let erros = 0
  let alerta = 0
  const input = elemento.parentNode.querySelectorAll('input')
  const span = elemento.parentNode.querySelectorAll('span')
  for (let i = 0; i < quantidadePerguntas.value; i++) {
    for (let j = 0; j < 10; j++) {
      // let pergunta = {}
      if (j === 0) {
        if (input[0 + i * 10].value.length < 20) {
          // alert('preencha os dados corretamente')
          // return true
          erros++
          dadosErrados(input[0 + i * 10], span[0 + i * 11])
        } else {
          verificaInput(input[0 + i * 10], span[0 + i * 11])
        }
      }
      if (j === 1) {
        if (
          input[1 + i * 10].value.slice(0, 1) !== '#' ||
          input[1 + i * 10].value.length !== 7 ||
          !verificaHexadecimal(input[1 + i * 10].value)
        ) {
          // alert('preencha os dados corretamente')
          // return true
          erros++
          dadosErrados(input[1 + i * 10], span[1 + i * 11])
        } else {
          verificaInput(input[1 + i * 10], span[1 + i * 11])
        }
      }
      if (j === 2 || j === 3) {
        // verificar se essa validação está correta
        if (input[j + i * 10].value.trim() === '') {
          // alert('preencha os dados corretamente')
          // return true
          erros++
          dadosErrados(input[j + i * 10], span[j + i * 11])
        } else {
          verificaInput(input[j + i * 10], span[j + i * 11])
        }
      }
      if (j === 3) {
        if (input[3 + i * 10].value.slice(0, 8) !== 'https://') {
          // alert('preencha os dados corretamente')
          // return true
          erros++
          dadosErrados(input[3 + i * 10], span[4 + i * 11])
        } else {
          verificaInput(input[3 + i * 10], span[4 + i * 11])
        }
      }
      // if (j === 5 || j === 7 || j === 9) {
      //   if (input[j + i * 10].value.slice(0, 8) !== 'https://') {
      //     erros++
      //     dadosErrados(input[j + i * 10], span[j + 1 + i * 11])
      //     if (input[j + i * 10].value.trim() === '') {
      //       erros--
      //     }
      //   } else {
      //     verificaInput(input[j + i * 10], span[j + 1 + i * 11])
      //   }
      // }
      if (j === 5 || j === 7 || j === 9) {
        if (input[j + i * 10].value !== '') {
          if (input[j + i * 10].value.slice(0, 8) !== 'https://') {
            erros++
            dadosErrados(input[j + i * 10], span[j + 1 + i * 11])
          } else {
            verificaInput(input[j + i * 10], span[j + 1 + i * 11])
          }
          if (input[j - 1 + i * 10].value === '') {
            erros++
            dadosErrados(input[j - 1 + i * 10], span[j + i * 11])
          } else {
            verificaInput(input[j - 1 + i * 10], span[j + i * 11])
          }
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
        erros++
        alerta++
        // alert(
        //   'É obrigatório a inserção de pelos menos uma resposta errada em cada pergunta'
        // )
        // return true
      }
      if (j === 4 || j === 6 || j === 8) {
        if (input[j + i * 10].value !== '') {
          if (input[j + 1 + i * 10].value.slice(0, 8) !== 'https://') {
            erros++
            dadosErrados(input[j + 1 + i * 10], span[j + 2 + i * 11])
          } else {
            verificaInput(input[j + 1 + i * 10], span[j + 2 + i * 11])
          }
        }
        // if (
        //   elemento.parentNode
        //     .querySelectorAll('input')
        //     [j + i * 10].value.trim() === '' &&
        //   elemento.parentNode
        //     .querySelectorAll('input')
        //     [j + 1 + i * 10].value.trim() === ''
        // ) {
        //   perguntasErradasVazias++
        // }
      }
    }
  }
  // if (perguntasErradasVazias > 2 * quantidadePerguntas.value) {
  //   erros++
  //   alerta++
  //   // return true
  // }
  if (erros > 0) {
    if (alerta > 0) {
      alert(
        'É obrigatório a inserção de pelos menos uma resposta incorreta em cada pergunta'
      )
    }
    return true
  }
}
function verificarNiveis() {
  let erros = 0
  const input = document.querySelector('.niveis').querySelectorAll('input')
  const span = document.querySelector('.niveis').querySelectorAll('span')
  for (let i = 0; i < quantidadeNivel.value; i++) {
    for (j = 0; j < 4; j++) {
      if (j === 0) {
        if (input[0 + 4 * i].value.length < 10) {
          // alert('Preencha os dados corretamente')
          // return true
          erros++
          dadosErrados(input[0 + i * 4], span[j + i * 4])
        } else {
          verificaInput(input[0 + i * 4], span[j + i * 4])
        }
      }
      if (j === 1) {
        if (input[1 + 4 * i].value < 0 || input[1 + 4 * i].value > 100) {
          // alert('Preencha os dados corretamente')
          // return true
          erros++
          dadosErrados(input[1 + i * 4], span[1 + i * 4])
        } else {
          verificaInput(input[0 + i * 4], span[j + i * 4])
        }
      }
      if (j === 2) {
        if (input[2 + 4 * i].value.slice(0, 8) !== 'https://') {
          // alert('Preencha os dados corretamente')
          // return true
          erros++
          dadosErrados(input[2 + i * 4], span[2 + i * 4])
        } else {
          verificaInput(input[2 + i * 4], span[2 + i * 4])
        }
      }
      if (j === 3) {
        if (input[3 + 4 * i].value.length < 30) {
          // alert('Preencha os dados corretamente')
          // return true
          erros++
          dadosErrados(input[3 + i * 4], span[3 + i * 4])
        } else {
          verificaInput(input[3 + i * 4], span[3 + i * 4])
        }
      }
    }
  }

  let contador = 0
  for (let i = 0; i < quantidadeNivel.value; i++) {
    if (input[1 + 4 * i].value == 0) {
      contador++
    }
  }
  // if (contador === 0) {
  //   // alert('Preencha os dados corretamente')
  //   // return true
  //   erros++
  // }
  if (contador === 0) {
    alert(
      'É obrigatório existir pelo menos 1 nível cuja % de acerto mínima seja 0%'
    )
    return true
  }
  if (erros > 0) {
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
        <span class = "escondido">Texto da pergunta: no mínimo 20 caracteres</span>
        <input type="text" placeholder="Cor de fundo da pergunta" />
        <span class = "escondido">Cor de fundo: deve ser uma cor em hexadecimal (começar em "#", seguida de 6 caracteres hexadecimais, ou seja, números ou letras de A a F)</span>
        <h6>Resposta correta</h6>
        <input type="text" placeholder="Resposta correta" />
        <span class = "escondido">Esse campo é obrigatório</span>
        <input type="url" placeholder="URL da imagem" />
        <span class = "escondido">Esse campo é obrigatório</span>
        <span class = "escondido">URL das imagens de resposta: deve ter formato de URL</span>
        <h6>Respostas incorretas</h6>
        <input type="text" placeholder="Resposta incorreta 1" />
        <span class = "escondido">Preencha esse campo para criar sua resposta</span>
        <input type="url" placeholder="URL da imagem 1" />
        <span class = "escondido">Deve ter formato de URL</span>
        <input type="text" placeholder="Resposta incorreta 2" />
        <span class = "escondido">Preencha esse campo para criar sua resposta</span>
        <input type="url" placeholder="URL da imagem 2" />
        <span class = "escondido">Deve ter formato de URL</span>
        <input type="text" placeholder="Resposta incorreta 3" />
        <span class = "escondido">Preencha esse campo para criar sua resposta</span>
        <input type="url" placeholder="URL da imagem 3" />
        <span class = "escondido">Deve ter formato de URL</span>
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
      pai.parentNode.querySelector('h4').scrollIntoView()
    } else if (elemento.parentNode.parentNode.parentNode === li[i]) {
      li[i - 1].scrollIntoView()
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
          <span class = "escondido">Título do nível: mínimo de 10 caracteres</span>
          <input type="text" placeholder="% de acerto mínima" />
          <span class = "escondido">% de acerto mínima: um número entre 0 e 100</span>
          <input type="url" placeholder="URL da imagem do nível" />
          <span class = "escondido">URL da imagem do nível: deve ter formato de URL</span>
          <input
          class="descricao"
          type="text"
          placeholder="Descrição do nível"
          />
          <span class = "escondido">Descrição do nível: mínimo de 30 caracteres</span>
        </div>
    </li>
    `
  }
}
function renderizarSeusQuizzes() {
  const localizar = document.querySelector('.containerQuizz')
  localizar.innerHTML = ''
  for (let i = seusQuizzes.length - 1; i >= 0; i--) {
    localizar.innerHTML += `
    <div class="containerImagem" onclick="selecionarQuizz(this)">
    <div class="fundoDegrader"></div>
    <img data-id="${seusQuizzes[i].id}" src=${seusQuizzes[i].image} alt=""/>
    <p>${seusQuizzes[i].title}</p>
  </div>
  `
  }
  verificarSeusQuizzes()
}
function voltarHome() {
  // document.querySelector('.telaQuizzPronto').classList.toggle('escondido')
  // document.querySelector('.tela3').classList.toggle('escondido')
  // document.querySelector('.tela1').classList.toggle('escondido')
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
  const QuizzParaSeremRenderizados = todosQuizz.filter(function (quizz) {
    for (let i = 0; i < seusQuizzes.length; i++) {
      if (quizz.id === seusQuizzes[i].id) {
        return false
      }
    }
    return true
  })
  
  renderizarTodosQuizzes(QuizzParaSeremRenderizados)
    
  
  
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
// function SeuQuizzSelecionado(quizz) {
//   console.log('oi')
//   const dataId = quizz.querySelector('[data-id]').getAttribute('data-id')
//   const quizzSelecionado = seusQuizzes.filter(function (elemento) {
//     if (elemento.id == dataId) {
//       return true
//     }
//     return false
//   })
//   renderizarQuizzSelecionado(quizzSelecionado)
//   doc
// }

function renderizarQuizzSelecionado(quizzSelecionado) {
  
  window.scrollTo(0, 0)

  const quizzTitle = document.querySelector('.quizztitle')
  const title = document.querySelector('.quizztitle p')
  const tela2 = document.querySelector('.tela2')
  const perguntasDosQuizz = document.querySelector('.perguntasDoQuizz')
  const perguntas = quizzSelecionado[0].questions
  levels = quizzSelecionado[0].levels

  tela2.innerHTML = ''

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
  tela2.innerHTML += `<div class="resultadoQuizz escondido"></div>`
}

function embaralharRespostas() {
  return Math.random() - 0.5
}

function respostaEscolhida(elemento, qtdPerguntas) {
  const clicado = elemento.parentNode
  const opcoesDeRespostas = elemento.parentNode.querySelectorAll('.opcao')
  const pergunta = document.querySelectorAll('.perguntasDoQuizz')

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
  setTimeout(function () {
    if (qtdPerguntas > jogadas) {
      console.log(jogadas)
      pergunta[jogadas].scrollIntoView()
    }
  }, 2000)

  clicado.classList.add('clicado')
  if (jogadas === qtdPerguntas) {
    fimDeJogo(acertos, qtdPerguntas, levels)
  }
}

function fimDeJogo(acertos, qtdPerguntas, levels) {
  // const tela2 = document.querySelector('.tela2')
  const resultadoQuizz = document.querySelector('.resultadoQuizz')
  resultadoQuizz.classList.remove('escondido')

  const porcentagem = Math.floor((acertos * 100) / qtdPerguntas)
  let verificarLevel = 0
  let resultadoLevel = []
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
  faixaDelevel.sort((a, b) => a - b)
  for (let i = 0; i < faixaDelevel.length; i++) {
    if (porcentagem > faixaDelevel[faixaDelevel.length - 1]) {
      verificarLevel = faixaDelevel[faixaDelevel.length - 1]
      break
    }
    if (porcentagem == faixaDelevel[i]) {
      verificarLevel = faixaDelevel[i]
      break
    }
    if (porcentagem <= faixaDelevel[i]) {
      verificarLevel = faixaDelevel[i - 1]
    }
  }

  function verificar(levels, verificarLevel) {
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].minValue === verificarLevel) {
        resultadoLevel.push(levels[i])
      }
    }

    console.log(levels)
    console.log(verificarLevel)
  }
  verificar(levels, verificarLevel)
  console.log(resultadoLevel)

  // const resultadoQuizz = document.querySelector(".resultadoQuizz");

  const renderizarTitulo = document.querySelector('.porcentagemAcerto')
  const renderizarImgEhTexto = document.querySelector(
    '.resultadoQuizz .resultado'
  )

  renderizarTitulo.innerHTML = `<p> ${porcentagem}% de acerto:${resultadoLevel[0].title}</p>`
  renderizarImgEhTexto.innerHTML = `
                                    <img src="${resultadoLevel[0].image}" alt="">
                                    <p>${resultadoLevel[0].text}</p>
  `

  setTimeout(function () {
    resultadoQuizz.scrollIntoView()
  }, 2000)
}

function reiniciarQuizz() {
  const opcoesDeRespostas = document.querySelectorAll('.opcoesDeRespostas')
  const resultado = document.querySelector('.resultadoQuizz')
  resultado.classList.add('escondido')

  opcoesDeRespostas.forEach(opcao => {
    console.log(opcao)
    console.log(opcao.querySelectorAll('.naoSelecionado'))

    const naoSelecionado = opcao.querySelectorAll('.naoSelecionado')
    naoSelecionado.forEach(div => {
      div.classList.remove('naoSelecionado')
    })

    let textos = opcao.querySelectorAll('p')
    textos.forEach(texto => {
      texto.style.color = 'black'
    })

    opcao.classList.remove('clicado')
  })
  jogadas = 0
  acertos = 0

  renderizarQuizzSelecionado(quizzSelecionado[0])
}

pegarQuizz()
function pegarQuizzDoNavegador() {
  const pegarQuizz = localStorage.getItem('seusQuizzes')
  if (pegarQuizz === null) {
    return
  }
  const dadosDeserializados = JSON.parse(pegarQuizz)
  seusQuizzes = dadosDeserializados
  seusQuizzes.map(function (quizz) {
    todosQuizz.push(quizz)
  })
}
function mandarQuizzParaNavegador() {
  const dadosSerializados = JSON.stringify(seusQuizzes)
  localStorage.setItem('seusQuizzes', `${dadosSerializados}`)
}
function mandarQuizzServidor(quizz) {
  const quizzMandadoServidor = axios.post(API, quizz)
  quizzMandadoServidor.then(function (response) {
    seuQuizz.id = response.data.id
    seuQuizz.key = response.data.key
    seusQuizzes.push(quizz)
    let localizar = document.querySelector('.quizzNovo')
    let renderizarBotao = document.querySelector('.telaQuizzPronto')
    localizar.innerHTML = ''
    localizar.innerHTML += `
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
    renderizarBotao.innerHTML += `
    <div class="botaoAcessarQuizz" onclick="acessarQuizz()">
      Acessar Quizz
    </div>
    <div class="botaoVoltarHome" onclick="voltarHome()">
      Voltar pra home
    </div>
    `
    renderizarSeusQuizzes()
    mandarQuizzParaNavegador()
    seuQuizz = {}
    for (let i = 0; i < 4; i++) {
      document.querySelectorAll('input')[i].value = ''
    }
  })

  quizzMandadoServidor.catch(function () {
    alert('dados incorretos\ninsira os dados corretos')
    document.querySelector('.telaQuizzPronto').classList.toogle('escondido')
    document
      .querySelector('telaCrieSuasPerguntas')
      .classList.toggle('escondido')
  })
}
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
function acessarQuizz() {
  document.querySelector('.tela3').classList.toggle('escondido')
  document.querySelector('.quizztitle').classList.toggle('escondido')
  document.querySelector('.tela2').classList.toggle('escondido')
  quizzSelecionado.push(seusQuizzes[seusQuizzes.length - 1])
  renderizarQuizzSelecionado(quizzSelecionado)
}
function verificaInput(input, span) {
  if (input.classList.contains('inputErro') === true) {
    input.classList.remove('inputErro')
    span.classList.add('escondido')
  }
}
function dadosErrados(input, span) {
  if (input.classList.contains('inputErro') === false) {
    input.classList.add('inputErro')
    span.classList.remove('escondido')
  }
}


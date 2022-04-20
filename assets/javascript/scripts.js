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

function selecionarQuizz() {}

import 'highlight-within-textarea/jquery.highlight-within-textarea'
import 'highlight-within-textarea/jquery.highlight-within-textarea.css'
import './highlight-marks.scss'
import './editor.scss'

const methods = [
  /si/gi, /afficher/gi, /afficherl/gi, /saisir/gi,
  /alors/gi, /sinon/gi, /fin/gi, /tant que/gi, /faire/gi,
  /repéter/gi, /retourner/gi, /appeler/gi
]

const args = /[[ ][\w]+,]?[ ]*[\w]+/gm

const variables = /[\w]+[ ]*["="].*/gm

const conditions = /[\w]+[ ]*[">"|"<"|">="|"<="|"=="].*/gm

function functions (input) {
  const declarations = input.match(/[\w]*[ ]*[":"][ ]*[\w, ]*/gm)

  if (declarations === null || declarations.length === 0) return false

  const names = declarations.map(f => f.split(':')[0])

  return [...declarations.map(f => f.split(':')[0] + ':'), ...names]
}

export default function highlight (element) {
  element.highlightWithinTextarea({
    highlight: [{
      highlight: [methods],
      className: 'methods'
    }, {
      highlight: [functions],
      className: 'functions'
    }, {
      highlight: [variables],
      className: 'variables'
    }, {
      highlight: [args],
      className: 'args'
    }, {
      highlight: [conditions],
      className: 'conditions'
    }]
  })
}

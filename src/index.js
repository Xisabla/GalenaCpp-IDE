import dragDrop from 'drag-drop/buffer'
import * as $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'highlight-within-textarea/jquery.highlight-within-textarea.css'
import 'highlight-within-textarea/jquery.highlight-within-textarea'
import './editor.scss'

dragDrop('body', (files, pos, fileList, directories) => {
    files.forEach(file => {
      let str = new TextDecoder("utf-8").decode(file)
      
      $('#editor').val(str)
      $('#editor').highlightWithinTextarea('update')
    });
})

class gppFunction {
    constructor(name, args) {
        this.name = name
        this.argc = args.length
        this.args = args
    }

    find(input) {
        return input.match(/[\w]*[ ]*[":"][ ]*[\w, ]*/gm).filter(d => {
            return d.split(':')[0].replace(/ /g, '') === this.name
        })[0]
    }
}

class gppFunctionCollection extends Array {
    getDefinitions() {
        return this.map(f => new RegExp(f.name + '[ ]*[:]'))
    }

    getNames() {
        return this.map(f => f.name)
    }
}

gppFunction.definitionRegex = /[\w]*[ ]*[":"][ ]*[\w, ]*/gm

let gppFunctions = new gppFunctionCollection()

let methods = [
    'si', 'afficher', 'afficherl', 'saisir',
    'alors', 'sinon', 'fin', 'tant que', 'faire',
    'repéter', 'retourner', 'appeler'
]

methods.forEach(m => methods.push(m.toUpperCase()))

let args = /[[ ]\w,]?[ ]*\w/gm
let variables = /[\w][ ]*["="].*/gm
let conditions = /[\w][ ]*[">"|"<"|">="|"<="|"=="].*/gm
let options = /["%option"].*/gm

function getFunctions(input) {
    gppFunctions = new gppFunctionCollection()
    let definitions = input.match(gppFunction.definitionRegex)

    if(definitions === null) return false

    definitions.forEach(definition => {
        definition = definition.replace(/ /g, '');
        let [ name, args ] = definition.split(":")
        args = args.split(',')
        
        gppFunctions.push(new gppFunction(name, args))
    })

    return [
        ...gppFunctions.getDefinitions(),
        ...gppFunctions.getNames()
    ]
}


$('#editor').highlightWithinTextarea({
    highlight: [
        {
            highlight: [ methods ],
            className: 'lblue'
        }, {
            highlight: [getFunctions, variables ],
            className: 'blue'
        }, {
            highlight: [args],
            className: 'pink'
        }, {
            highlight: [ conditions ],
            className: 'red'
        }, {
            highlight: [ /*options*/ ],
            className: 'turbo'
        }
    ]
});

$('#editor').keydown(function(e) {
    if(e.keyCode === 9) {
        e.preventDefault()

        let start = this.selectionStart
        let end = this.selectionEnd
        this.value = this.value.substring(0, start) + "\t" + this.value.substring(end)
        this.selectionEnd = start + 1
    }
})

function exportFile() {
    let data = $('#editor').val()
    let file = new Blob([data], { type: 'text/plain' })
    let filename = 'source.gpp'

    if(window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, filename)
    else {
        let a = document.createElement('a')
        let url = URL.createObjectURL(file)

        a.href = url
        a.download = filename

        document.body.appendChild(a)
        a.click()

        setTimeout(function() {
            document.body.removeChild(a)
            document.URL.revokeObjectURL(url)
        }, 0)
    }
}

$(window).bind("keydown", function(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case "s":
        event.preventDefault();
        exportFile()
        break;
    }
  }
});


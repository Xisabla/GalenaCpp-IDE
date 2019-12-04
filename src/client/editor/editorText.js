import PageComponent from '../lib/pageComponent'
import highlight from './highlight'

export default class EditorText extends PageComponent {
  constructor (container, code) {
    super(container)

    const defaultCode = code || '%option ecrire\n\nsum: a,b\n    retourner a + b\n\nafficher appeler sum 1,2'

    this.textarea = $('<textarea></textarea>', {
      id: 'editor',
      class: 'form-control'
    }).val(defaultCode)
  }

  load () {
    this.container.append(this.textarea)

    this.textarea.on('keydown', (event) => {
      if (event.keyCode === 9) { this.appendTab(event) }
      // if enter, append same tabs as above
      // if return, check tabs and erase
    })

    highlight(this.textarea)
  }

  appendTab (event) {
    event.preventDefault()

    const start = event.currentTarget.selectionStart
    const end = event.currentTarget.selectionEnd
    const indent = this.ide.config.indent

    for (let i = 0; i < indent; i++) {
      event.currentTarget.value = event.currentTarget.value.substring(0, start) + ' ' + event.currentTarget.value.substring(end)
    }

    event.currentTarget.selectionEnd = start + indent

    this.textarea.highlightWithinTextarea('update')
  }

  setCode (code) {
    this.textarea.val(code)

    this.update()
  }

  get code () {
    return this.textarea.val()
  }

  update () {
    this.textarea.highlightWithinTextarea('update')
  }

  destroy () {
    this.textarea.highlightWithinTextarea('destroy')
    this.textarea.remove()
  }
}

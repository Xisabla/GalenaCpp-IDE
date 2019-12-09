import Page from '../lib/page'

import path from 'path'

export default class Settings extends Page {
  constructor (...args) {
    super(...args)

    // Home container
    this.container = $('<div></div>', {
      class: 'jumbotron container'
    })

    // Elements

    this.title = $('<h1></h1>', {
      class: 'display-1 text-center'
    }).text('Settings')

    this.form = $('<form></form>')

    this.runnerGroup = $('<div></div>', {
      class: 'form-group'
    })

    this.runnerLabel = $('<label></label>').text('Runner executable')
    this.runnerInput = $('<input></input>', {
      type: 'text',
      class: 'form-control'
    }).val(this.ide.config.executable)

    this.indentGroup = $('<div></div>', {
      class: 'form-group'
    })

    this.indentLabel = $('<label></label>').text('Indent Size')
    this.indentInput = $('<input></input>', {
      type: 'number',
      class: 'form-control'
    }).val(this.ide.config.indent)

    this.displayGroup = $('<div></div>', {
      class: 'form-group'
    })

    this.displayLabel = $('<label></label>').text('Display')
    this.displayInput = $('<input></input>', {
      type: 'text',
      class: 'form-control'
    }).val(this.ide.config.display)

    this.formSubmit = $('<input></input>', {
      type: 'submit',
      class: 'btn btn-success'
    })
  }

  load () {
    super.load()

    // Append
    this.indentGroup.append(this.indentLabel)
    this.indentGroup.append(this.indentInput)
    this.runnerGroup.append(this.runnerLabel)
    this.runnerGroup.append(this.runnerInput)
    this.displayGroup.append(this.displayLabel)
    this.displayGroup.append(this.displayInput)
    this.form.append(this.indentGroup)
    this.form.append(this.runnerGroup)
    this.form.append(this.displayGroup)
    this.form.append(this.formSubmit)
    this.container.append(this.form)
    this.ide.container.append(this.title)
    this.ide.container.append(this.container)

    this.form.on('submit', (e) => {
      e.preventDefault()

      this.ide.config.indent = this.indentInput.val()
      this.ide.config.executable = path.resolve(this.runnerInput.val())
      this.ide.config.display = this.displayInput.val()

      this.ide.writeConfig()

      this.ide.load(this.ide.pages[1].file.content !== null ? 1 : 0)
    })
  }

  destroy () {
    this.container.remove()
  }
}

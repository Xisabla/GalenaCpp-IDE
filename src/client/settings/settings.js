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

    this.formSubmit = $('<input></input>', {
      type: 'submit',
      class: 'btn btn-success'
    })
  }

  load () {
    super.load()

    // Append
    this.runnerGroup.append(this.runnerLabel)
    this.runnerGroup.append(this.runnerInput)
    this.form.append(this.runnerGroup)
    this.form.append(this.formSubmit)
    this.container.append(this.form)
    this.ide.container.append(this.title)
    this.ide.container.append(this.container)

    this.form.on('submit', (e) => {
      e.preventDefault()

      this.ide.config.executable = path.resolve(this.runnerInput.val())
    })
  }

  destroy () {
    this.container.remove()
  }
}

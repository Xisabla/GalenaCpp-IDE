import './home.scss'

import Page from '../lib/page'
import icon from '../../images/icon.png'

export default class Home extends Page {
  constructor (...args) {
    super(...args)

    // Home container
    this.container = $('<div></div>', {
      class: 'jumbotron container text-center home'
    })

    // Elements

    this.title = $('<h1></h1>', {
      class: 'title display-1 text-center'
    }).text('IDE - GalenaCpp')

    this.icon = $('<img>', {
      src: icon,
      class: 'icon'
    })

    this.new = $('<a></a>', {
      class: 'btn btn-outline-primary btn-large'
    }).text('New File')

    this.open = $('<a></a>', {
      class: 'btn btn-outline-primary btn-large'
    }).text('Open File')
  }

  load () {
    super.load()

    // Append
    this.ide.container.append(this.title)
    this.ide.container.append(this.container)
    this.container.append(this.icon)
    this.container.append(this.new)
    this.container.append(this.open)

    // Effects

    this.new.on('click', () => this.ide.newFile())

    this.open.on('click', () => this.ide.openFile())
  }

  destroy () {
    this.icon.remove()
    this.new.remove()
    this.open.remove()
    this.container.remove()
  }
}

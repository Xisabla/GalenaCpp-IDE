import PageComponent from '../lib/pageComponent'
import './terminal.scss'
import { exec } from 'child_process'

export default class Terminal extends PageComponent {
  constructor (...args) {
    super(...args)

    this.child = null

    this.output = $('<ul></ul>', {
      id: 'terminalOutput'
    })

    this.inputForm = $('<form></form>')
    this.input = $('<input></input>', {
      id: 'terminalInput',
      type: 'text',
      placeholder: ' > Console input'
    })
  }

  load () {
    this.inputForm.append(this.input)
    this.container.append(this.output)
    this.container.append(this.inputForm)

    this.inputForm.submit((e) => {
      e.preventDefault()

      this.read(this.input.val())
      this.input.val('')
    })
  }

  destroy () {
    this.output.remove()
    this.input.remove()
  }

  run (cmd) {
    this.child = exec(cmd)

    this.child.stdout.on('data', (data) => this.write(data))
    this.child.stderr.on('data', (data) => this.write(data))
  }

  write (content) {
    const splitted = content.split('\n')

    if (splitted.length > 1) {
      return splitted.forEach(line => {
        this.write(line)
      })
    }

    this.output.animate({
      scrollTop: this.output.get(0).scrollHeight
    }, 10)

    return this.output.append($('<li></li>').text(content))
  }

  read (content) {
    if (this.child && this.child.stdin && this.child.stdin.writable) {
      this.write(content)
      this.child.stdin.write(content + '\n')
    }
  }
}

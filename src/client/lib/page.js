export default class Page {
  constructor (ide) {
    this.ide = ide
    this.container = this.ide.container
  }

  load () {
    this.ide.clear()
  }

  destroy () {
    console.log('Todo: Destroy page')
  }
}

export default class PageComponent {
  constructor (page) {
    this.ide = page.ide
    this.container = page.container
  }

  load () {
    console.log('Todo: Load component')
  }

  destroy () {
    console.log('Todo: Destroy component')
  }
}

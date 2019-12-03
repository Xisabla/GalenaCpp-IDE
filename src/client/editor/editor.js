import Page from '../lib/page'

import dragDrop from 'drag-drop/buffer'
import EditorText from './editorText'

export default class Editor extends Page {
  // ide !!, code, path, filename, ...
  constructor (...args) {
    super(...args)

    this.editorText = new EditorText(this)

    this.dragRemove = dragDrop('body', (files) => {
      if (this.ide.currentPage !== this) return false
      if (!files || files.length < 1) return false

      const file = files[0]
      const code = new TextDecoder('utf-8').decode(file)

      this.editorText.setCode(code)
    })
  }

  load (filename, content) {
    super.load()

    // Update file properties
    if (!filename && !this.filename) this.filename = 'new_file.gpp'
    if (!filename && this.filename) filename = this.filename
    if (!content && this.content) content = this.content

    this.filename = filename
    this.content = content

    // TODO: filename -> become input on double click
    this.container.append(`<h1>${filename}</h1>`)
    this.editorText.load()

    if (content) this.editorText.setCode(content)
    // TODO: save on ctrl + s
  }

  destroy () {
    this.dragRemove()
    this.editorText.destroy()
  }
}

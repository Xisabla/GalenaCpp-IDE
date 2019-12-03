import Page from '../lib/page'

import dragDrop from 'drag-drop/buffer'
import EditorText from './editorText'

import fs from 'fs'
import { remote } from 'electron'
import { exec } from 'child_process'

const { dialog } = remote

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

    this.file = {
      filepath: null,
      filename: null,
      content: null
    }
  }

  load (file) {
    super.load()

    if (!file) { file = this.file }

    if (!file.filename) file.filename = 'source.gpp'
    if (!file.content) file.content = '%option ecrire\n\n'

    this.file = file

    // TODO: filename -> become input on double click
    this.container.append(`<h1>${file.filename}</h1>`)
    this.editorText.load()

    if (file.content) this.editorText.setCode(file.content)
  }

  save () {
    this.file.content = this.editorText.code

    if (!this.file.filepath) {
      return this.saveAs()
    }

    return fs.writeFileSync(this.file.filepath, this.file.content)
  }

  saveAs () {
    this.file.content = this.editorText.code

    return dialog.showSaveDialog().then(dialogFiles => {
      const filepath = dialogFiles.filePath

      if (!filepath) return false

      return fs.writeFileSync(filepath, this.file.content)
    })
  }

  run () {
    if (!this.file || !this.file.filename || !this.file.content) return false

    this.save()

    // Using wsl
    const cmd = `wsl ${this.ide.config.executable} ${this.file.filepath}`
      .replace(/C:\\/g, '/mnt/e/')
      .replace(/D:\\/g, '/mnt/d/')
      .replace(/E:\\/g, '/mnt/e/')
      .replace(/\\/g, '/')

    console.log(cmd)

    const child = exec(cmd)

    child.stdout.on('data', (data) => console.log(data))
    child.stderr.on('data', (data) => console.log(data))
  }

  destroy () {
    this.dragRemove()
    this.editorText.destroy()
  }
}

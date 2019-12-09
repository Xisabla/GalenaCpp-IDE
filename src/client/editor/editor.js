import Page from '../lib/page'

import dragDrop from 'drag-drop/buffer'
import EditorText from './editorText'

import fs from 'fs'
import { remote } from 'electron'
import Terminal from './terminal'
import path from 'path'

const { dialog } = remote

export default class Editor extends Page {
  // ide !!, code, path, filename, ...
  constructor (...args) {
    super(...args)

    this.editorText = new EditorText(this)
    this.terminal = new Terminal(this)
    this.title = $('<h1></h1>').text('file')

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

    this.container.append(this.title)
    this.title.text(file.filename)
    this.editorText.load()
    this.terminal.load()
    this.terminal.write('Opened file ' + file.filename)

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

      const filename = path.basename(filepath)
      this.rename(filename)
      this.file.filename = filename
      this.file.filepath = filepath
      this.file.content = this.editorText.code

      return fs.writeFileSync(filepath, this.file.content)
    })
  }

  rename (name) {
    this.file.filename = name
    this.title.text(name)
    this.terminal.write('Renamed file to ' + name)
  }

  run () {
    if (!this.file || !this.file.filename || !this.file.content) return false

    this.save()
    this.terminal.write('Running file')

    const cmd = `wsl DISPLAY=${this.ide.config.display} ${this.ide.config.executable} ${this.file.filepath}`
      .replace(/C:\\/g, '/mnt/c/')
      .replace(/D:\\/g, '/mnt/d/')
      .replace(/E:\\/g, '/mnt/e/')
      .replace(/\\/g, '/')

    this.terminal.run(cmd)
  }

  destroy () {
    this.dragRemove()
    this.editorText.destroy()
    this.terminal.destroy()
  }
}

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min'

import Home from './home/home'
import Editor from './editor/editor'

import { remote } from 'electron'
import path from 'path'
import fs from 'fs'
import Settings from './settings/settings'

const { /* app, */ dialog, Menu /* MenuItem */ } = remote

export default class IDE {
  constructor (container, config) {
    this.container = container
    this.currentPage = null

    this.readConfig(config)

    this.setMenu()

    this.pages = [
      new Home(this),
      new Editor(this),
      new Settings(this)
    ]

    this.load(0)

    console.info('IDE Loaded')
  }

  readConfig (config) {
    // Default config
    this.config = {
      indent: 4,
      executable: 'E:\\Projects\\Lab\\GalenaCpp\\program'
    }

    // Read given config
    if (config) {
      if (config.indent) this.config.indent = config.indent
    }
  }

  setMenu () {
    // https://electronjs.org/docs/api/menu#main-process
    // https://stackoverflow.com/a/52624682/8110666

    const menuTemplate = [
      {
        label: 'File',
        submenu: [
          { label: 'New File', accelerator: 'Ctrl+N', click: () => { this.newFile() } },
          { label: 'Open File', accelerator: 'Ctrl+O', click: () => { this.openFile() } },
          { type: 'separator' },
          // TODO: For save, and saveAs, keep (somewhere) the file path
          //  set it to null for new files (or for saveAs) and prompt it
          //  if it's null
          { label: 'Save', accelerator: 'Ctrl+S', click: () => { this.save() } },
          { label: 'Save As', accelerator: 'Ctrl+Shift+S', click: () => { this.saveAs() } },
          { type: 'separator' },
          { label: 'Settings', accelerator: 'Ctrl+,', click: () => { this.load(2) } },
          { type: 'separator' },
          { role: 'quit', accelerator: 'Ctrl+Q' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ]
      },
      {
        label: 'Run',
        submenu: [
          // TODO: For run, automatically call save, then look for the gpp executable
          //  in the settings, focus on the editor and then run the command and pipe
          // the output on the editor terminal
          // TODO -Bis: If no opened, don't try to save default file, just say "nope"
          { label: 'Run', accelerator: 'F5', click: () => { this.run() } }
        ]
      },
      {
        label: 'View',
        submenu: [
          { label: 'Homepage', accelerator: 'Ctrl+H', click: () => { this.load(0) } },
          { label: 'Editor', accelerator: 'Ctrl+E', click: () => { this.load(1) } },
          { label: 'Settings', accelerator: 'Ctrl+,', click: () => { this.load(2) } },
          { type: 'separator' },
          { role: 'reload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      }
    ]

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
  }

  clear () {
    // If on a page, destroy page
    if (this.currentPage) this.currentPage.destroy()

    // Reset page and clear container
    this.currentPage = null
    this.container.children().not('script').remove()
  }

  load (page, ...args) {
    // Check for valid given page
    if (typeof (page) === 'number') return this.load(this.pages[page], ...args)
    if (!page || page === null || typeof (page) !== 'object') return false

    // Load page
    page.load(...args)

    // Set the current page
    this.currentPage = page
  }

  // Open editor with given file
  open (...args) {
    this.load(1, ...args)
  }

  save () {
    return this.pages[1].save()
  }

  saveAs () {
    return this.pages[1].saveAs()
  }

  run () {
    return this.pages[1].run()
  }

  // Open a new file
  newFile () {
    this.open({ filename: 'source.gpp' })
  }

  // Select and open a file
  openFile () {
    // https://electronjs.org/docs/api/dialog#dialogshowopendialogbrowserwindow-options
    dialog.showOpenDialog({ properties: ['openFile'] })
      .then(dialogFiles => {
        const files = dialogFiles.filePaths

        if (files.length > 0) {
          const filepath = files[0]

          const filename = path.basename(filepath)
          const content = fs.readFileSync(filepath, {
            encoding: 'utf-8'
          })

          this.open({ filepath, filename, content })
        }
      })
  }
}
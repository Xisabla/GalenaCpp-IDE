import {
  app,
  BrowserWindow,
  ipcMain as ipc
} from 'electron'

function createWindow () {
  const win = new BrowserWindow({
    title: 'Omega',
    x: 0,
    y: 0,
    minWidth: 900,
    minHeight: 650,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  ipc.on('ready', (event, arg) => {
    console.info('App is ready')
  })

  win.loadFile('../../index.html').catch(() => {
    console.warn('Page not loaded')
  })

  win.on('ready-to-show', () => {
    win.show()
  })
}

app.on('ready', createWindow)

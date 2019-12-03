import { app, BrowserWindow, ipcMain as ipc } from 'electron'
import icon from '../images/icon.png'

function createWindow () {
  const win = new BrowserWindow({
    title: 'IDE - GalenaCpp',
    x: 0,
    y: 0,
    minWidth: 900,
    minHeight: 650,
    icon: icon,
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

import path from 'path'
import { ipcRenderer as ipc, remote } from 'electron'
import * as $ from 'jquery'
import IDE from './ide'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min'

const { app } = remote

$(() => {
  ipc.send('ready', true)
  const configFile = path.join(app.getPath('appData'), 'galena_ide.json')

  const ide = new IDE($('body'), configFile)

  console.log(ide)
})

import { ipcRenderer as ipc } from 'electron'
import * as $ from 'jquery'
import IDE from './ide'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.min'

$(() => {
  ipc.send('ready', true)

  const ide = new IDE($('body') /* config */)

  console.log(ide)
})

var electron = require('electron')
var Menu = electron.Menu
var pack = require(electron.app.getAppPath() + '/package.json')

var menu = [
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' },
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWin) => { focusedWin && focusedWin.reload() },
      },
      {
        label: 'Toggle Full Screen',
        accelerator: `${process.platform == 'darwin' ? 'Ctrl+Command+F' : 'F11'}`,
        click: (item, focusedWin) => { focusedWin && focusedWin.setFullScreen(!focusedWin.isFullScreen()) },
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: `${process.platform == 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'}`,
        click: (item, focusedWin) => { focusedWin && focusedWin.toggleDevTools() },
      },
    ]
  },
  {
    label: 'Window', role: 'window',
    submenu: [
      { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
      //{ label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
    ]
  },
  {
    label: 'Help', role: 'help',
    submenu: [
      { label: 'Website', click: item => { electron.shell.openExternal(pack.homepage) } },
      { label: 'GitHub', click: item => { electron.shell.openExternal(pack.repository.url) } },
    ]
  },
]

if (process.platform == 'darwin') {
  var name = electron.app.getName()
  
  menu.unshift({
    label: name,
    submenu: [
      { label: 'About ' + name, role: 'about' },
      { type: 'separator'  },
      { label: 'Services', role: 'services', submenu: [] },
      { type: 'separator' },
      { label: 'Hide ' + name, accelerator: 'Command+H', role: 'hide' },
      { label: 'Hide Others', accelerator: 'Command+Alt+H', role: 'hideothers' },
      { label: 'Show All', role: 'unhide' },
      { type: 'separator' },
      { label: 'Quit', accelerator: 'Command+Q', click: item => { electron.app.quit() } },
    ]
  })
  
  // Window menu
  menu[3].submenu.push(
    { type: 'separator' },
    { label: 'Bring All to Front', role: 'front' }
  )
}

Menu.setApplicationMenu(Menu.buildFromTemplate(menu))

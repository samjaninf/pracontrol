'use strict'

require('./lib/DOMProto')

global.App = { ready: false }
global.WebComponentAbstract = require('./lib/WebComponent/WebComponentAbstract')
global.FlexBalanced = require('./lib/WebComponent/FlexBalanced')
global.TabComponent = require('./lib/WebComponent/TabComponent')
Object.assign(global, require('./lib/Globals'))

class PraControl extends WebComponentAbstract {
	initCallback() {
		// package info
		this.package = require('../package.json')
		
		// error reporting here, must load first
		this.newElement(require('./lib/UI/UI'), false)
		
		// new app element
		defineAppEvent("newElement", "Append element to app element", "Core", '{ instance: <HTMLElement> }')
		self.on('newElement', e => this.appendChild(e.d.instance))
		
		// render css then load content
		this.renderLessFile(`${__dirname}/css/style.less`, true)
			.then(() => setImmediate(() => this.main()))
	}
	
	main() {
		// core
		this.core = ['About', 'CommandList', 'Console', 'Dashboard', 'Developer', 'KeyShortcutsTable', 'Module', 'Panel', 'Printer', 'Serial', 'Tab']
		this.core.forEach(i => setImmediate(() => this.newElement(require(`./core/${i}/${i}`), false) ))
		
		// app ready event
		defineAppEvent("appReady", "Fires after all modules loaded", "Core")
		setImmediate(() => { this.ready = true; AppEvent('appReady') })
	}
}

global.App = document.body.newElement(PraControl)

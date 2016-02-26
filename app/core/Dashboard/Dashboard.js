'use strict'

var style = `
:host {
	display: block;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
}

::content > * {
	height: 100%;
	align-items: center;
}
`

module.exports = class Dashboard extends WebComponentAbstract {
	initCallback() {
		this.renderCss(style)
		
		defineAppEvent("newDashboard", "Create new dashboard item", "Dashboard", "{ instance: <HTMLElement> }")
		self.on('newDashboard', e => this.newItem(e.d.instance))
		
		this.content = this.newElement(FlexBalanced)
	}
	
	readyCallback() {
		AppEvent('newTab', { instance: this, title: 'Dashboard', priority: -90 })
	}
	
	newItem(instance) {
		this.content.appendChild(instance)
	}
}

'use strict'

var style = `
:host {
	display: block;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
}
`

module.exports = class KeyShortcutsTable extends WebComponentAbstract {
	initCallback() {
		this.renderCss(style)
		
		defineAppEvent('defineKeyShortcut', 'Add new item to shortcut table', 'Core', "{ key: '', desc: '' }")
		self.on('defineKeyShortcut', e => this.newShortcut(e.d))
		
		this.el = this.newElement(FlexBalanced)
	}
	
	readyCallback() {
		AppEvent('newTab', { instance: this, name: 'Shortcuts', priority: 800 })
	}
	
	newShortcut(k) {
		var div = this.el.querySelector(`div[cat='${k.cat}']`)
		
		if(!div) {
			div = this.el.newElement('div')
			div.setAttribute('cat', k.cat)
			var table = div.newElement('table')
			var thead = table.newElement('thead')
			
			var th = thead.newElement('tr').newElement('th', true, { colSpan: 2, textContent: k.cat })
			
			table.newElement('tbody')
		}
		
		var tr = div.querySelector("tbody").newElement('tr')
		tr.setAttribute('cat', k.cat)
		tr.newElement('td').newElement('kbd').textContent = k.key
		tr.newElement('td').textContent = k.desc
		
		this.el.balance()
	}
}

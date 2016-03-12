'use strict'

var style = `
:host {
	order: -100;
	flex-grow: 1;
	display: flex;
	flex-wrap: wrap;
	
	background-color: #333;
}

::content {
	
	> tab {
		padding: 0.5rem;
		color: #fff;
		cursor: pointer;
		font-size: 0.85em;
		
		&.active, &:hover { background-color: #666; }
		
		&[name='PraControl'] {
			background-image: url('img/logo.svg');
			background-position: center center;
			background-repeat: no-repeat;
			background-size: 75% 75%;
			font-size: 0;
			width: 1rem;
		}
	}
}
`

module.exports = class Tab extends TabComponent {
	initCallback() {
		this.renderLess(style)
		
		this.tabInit('Tab')
		self.on('newTab', e => AppEvent('newPanel', { instance: e.d.instance }))
		
		defineKeyShortcut('⌘1‑9', 'Go to tab 1‑9', "Tabs")
		self.on('keydown', e => (e.metaKey || e.ctrlKey) && this.tabNumberShortcut(e))
	}
	
	readyCallback() {
		AppEvent('newPanel', { instance: this, position: 'top' })
	}
	
	tabNumberShortcut(e) {
		if(e.keyCode < 49 || e.keyCode > 57) return
		this.toggle(e.keyCode - 49)
	}
}

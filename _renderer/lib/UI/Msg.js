'use strict'

var style = `
:host {
	position: absolute;
	display: block;
	z-index: 1;
	
	background-color: Highlight;
	bottom: 2rem; left: 1rem; right: 1rem;
	padding: 0em .2em; border-radius: .25em;
}

:host:empty { display: none; }

::content msg {
	display: block;
}
`

module.exports = class Msg extends WebComponentAbstract {
	initCallback() {
		this.renderCss(style)
		
		// error reporting
		self.on('error', e => this.msg((e.message && e.message.replace(/^[^:]*:/, '') || e.detail.message)))
		
		defineAppEvent('info', 'New info message', "Core", "{ msg: '' }")
		self.on('info', e => this.msg(e.d.msg))
		
		// append to DOM
		document.body.appendChild(this)
	}
	
	msg(msg) {
		var el = this.newElement('msg')
		el.textContent = msg
		setTimeout(() => el.removeElement(), 3000)
	}
}
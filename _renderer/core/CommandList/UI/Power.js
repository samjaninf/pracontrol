'use strict'

module.exports = class Power extends WebComponentAbstract {
	initCallback() {
	
		var p = this.newElement('p', true, { textContent: "Power " })
		p.newElement('a', true, { textContent: 'On', className: 'button' }).on('click', e => this.send('M80'))
		p.newText(' ')
		p.newElement('a', true, { textContent: 'Off', className: 'button' }).on('click', e => this.send('M81'))
		
		p.newElement('br')
		p.newText('Motors ')
		p.newElement('a', true, { textContent: 'On', className: 'button' }).on('click', e => this.send('M17'))
		p.newText(' ')
		p.newElement('a', true, { textContent: 'Off', className: 'button' }).on('click', e => this.send('M18'))
	}

	send(val) {
		AppEvent('serialWrite', { data: val, prepend: true })
	}
}
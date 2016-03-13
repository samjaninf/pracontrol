'use strict'

module.exports = class PositionMemory extends WebComponentAbstract {
	initCallback() {
		
		var p = this.newElement('p')
		p.newElement('a', true, { textContent: 'Save current coordinates', className: 'button' }).on('click', e => this.send('G60'))
		
		p.newElement('br')
		p.newText('Restore saved coordinates ')
		p.newElement('a', true, { textContent: 'X', className: 'button' }).on('click', e => this.send('G61 X'))
		p.newText(' ')
		p.newElement('a', true, { textContent: 'Y', className: 'button' }).on('click', e => this.send('G61 Y'))
		p.newText(' ')
		p.newElement('a', true, { textContent: 'Z', className: 'button' }).on('click', e => this.send('G61 Z'))
	}
	
	send(val) {
		AppEvent('serialWrite', { data: val, prepend: true })
	}
}

'use strict'

module.exports = class PasteExtruder extends WebComponentAbstract {
	initCallback() {
	
		var p = this.newElement('p', true, { textContent: "Heater 1 " })
		var slider1 = p.newElement('input', true, { type: 'range', min: 0, max: 255, step: 1, value: 0 })
		slider1.on('input', e => this.send(`M126 S${slider1.value}`))
		
		var p = this.newElement('p', true, { textContent: "Heater 2 " })
		var slider2 = p.newElement('input', true, { type: 'range', min: 0, max: 255, step: 1, value: 0 })
		slider2.on('input', e => this.send(`M128 S${slider2.value}`))
	}

	send(val) {
		AppEvent('serialWrite', { data: val, prepend: true })
	}
}

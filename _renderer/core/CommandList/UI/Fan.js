'use strict'

module.exports = class Fan extends WebComponentAbstract {
	initCallback() {
		
		var p = this.newElement('p', true, { textContent: "Fan " })
		
		var slider = p.newElement('input', true, { type: 'range', min: 0, max: 255, step: 1, value: 0 })
		slider.on('input', e => this.setSpeed(slider.value))
	}
	
	setSpeed(val) {
		AppEvent('serialWrite', { data: `M106 S${val}`, prepend: true })
	}
}

'use strict'

var style = `
::content label { white-space: nowrap; }
::content input[type='number'] { width: 5rem; }
::content input.jerk { width: 4rem; }
::content span.acc { min-width: 3rem; display: inline-block; }
`

module.exports = class Acceleration extends WebComponentAbstract {
	initCallback() {
		this.renderCss(style)
		
		var p = this.newElement('p', true, { textContent: 'Max acceleration ' })
		p.newElement('small', true, { textContent: 'mm/sec^2' })
		p.newElement('br')
		var opt = { type: 'number', step: 1 }
		var l = p.newElement('label')
		l.newElement('span', true, { textContent: 'Travel ', className: 'acc' })
		this.accTravel = l.newElement('input', true, opt)
		this.accTravel.on('input', e => this.accSet())
		p.newElement('br')
		var l = p.newElement('label')
		l.newElement('span', true, { textContent: 'Print ', className: 'acc' })
		this.accPrint = l.newElement('input', true, opt)
		this.accPrint.on('input', e => this.accSet())
		p.newElement('br')
		var l = p.newElement('label')
		l.newElement('span', true, { textContent: 'Retract ', className: 'acc' })
		this.accRetract = l.newElement('input', true, opt)
		this.accRetract.on('input', e => this.accSet())
		
		
		var p = this.newElement('p', true, { textContent: "Max jerk " })
		p.newElement('small', true, { textContent: 'mm/s/s' })
		p.newElement('br')
		var opt = { type: 'number', step: 1, className: 'jerk' }
		this.jerkXY = p.newElement('label', true, { textContent: 'XY ' }).newElement('input', true, opt)
		this.jerkXY.on('input', e => this.advancedSet())
		p.newText(' ')
		this.jerkZ = p.newElement('label', true, { textContent: 'Z ' }).newElement('input', true, opt)
		this.jerkZ.on('input', e => this.advancedSet())
		p.newText(' ')
		this.jerkE = p.newElement('label', true, { textContent: 'E ' }).newElement('input', true, opt)
		this.jerkE.on('input', e => this.advancedSet())
		p.newText(' ')
		
		var p = this.newElement('p', true, { textContent: "Min feed rate " })
		p.newElement('small', true, { textContent: 'mm/s/s' })
		p.newElement('br')
		var opt = { type: 'number', step: 1 }
		this.minFeedTravel = p.newElement('label', true, { textContent: 'Travel '}).newElement('input', true, opt)
		this.minFeedTravel.on('input', e => this.advancedSet())
		p.newText(' ')
		this.minFeedPrint = p.newElement('label', true, { textContent: 'Print '}).newElement('input', true, opt)
		this.minFeedPrint.on('input', e => this.advancedSet())
		
		var p = this.newElement('p', true, { textContent: "Min segment time " })
		var opt = { type: 'number', step: 1 }
		this.segmentTime = p.newElement('input', true, opt)
		this.segmentTime.on('input', e => this.advancedSet())
		p.newText(' ')
		p.newElement('small', true, { textContent: 'µs' })
		
		
		self.on('serialEcho', e => this.echo(e.d))
	}
	
	accSet() {
		var val = `P${this.accPrint.value} R${this.accRetract.value} T${this.accTravel.value}`
		AppEvent('serialWrite', { data: `M204 ${val}` })
	}
	
	accValue(msg) {
		var m = msg.match(/([0-9]+\.?[0-9]*)/g)
		this.accPrint.value = parseFloat(m[1])
		this.accRetract.value = parseFloat(m[2])
		this.accTravel.value = parseFloat(m[3])
	}
	
	advancedSet() {
		var val = `M205 S${this.minFeedPrint.value} T${this.minFeedTravel.value} B${this.segmentTime.value} X${this.jerkXY.value} Z${this.jerkZ.value} E${this.jerkE.value}`
		AppEvent('serialWrite', { data: `M205 ${val}` })
	}
	
	advancedValue(msg) {
		var m = msg.match(/([0-9]+\.?[0-9]*)/g)
		this.minFeedPrint.value = parseFloat(m[1])
		this.minFeedTravel.value = parseFloat(m[2])
		this.segmentTime.value = parseFloat(m[3])
		this.jerkXY.value = parseFloat(m[4])
		this.jerkZ.value = parseFloat(m[5])
		this.jerkE.value = parseFloat(m[6])
	}
	
	echo(msg) {
		if(msg.startsWith('M204')) this.accValue(msg)
		else if(msg.startsWith('M205')) this.advancedValue(msg)
	}
}
'use strict'

var styleBuffer = `
:host {
	order: -100;
	padding-left: 0.25rem;
	font-size: 0.85em;
}
`

var style = `
:host {
	order: 100;
	padding-right: 0.25rem;
	font-size: 0.85em;
	min-width: 10rem;
	text-align: right;
}
::content {
	> status {
		&.enabled { color: ForestGreen; }
	}
}
`

module.exports = class SerialStatus extends WebComponentAbstract {
	initCallback() {
		
		this.bufferStatus = this.newElement('buffer-status', false)
		this.bufferStatus.renderCss(styleBuffer)
		self.on('bufferChange', e => {
			var len = this.parent.buffer.buffer.length
			this.bufferStatus.textContent = 'Buffer ' + (len ? len : 'empty')
		})
		
		
		this.renderLess(style)
		
		this.textStatus = this.newElement('span')
		self.on('connect', e => this.textStatus.textContent = 'Connecting')
		self.on('connected', e => this.textStatus.textContent = 'Initialization')
		self.on('deviceOk', e => this.textStatus.textContent = 'Ready')
		self.on('deviceNotOk', e => this.textStatus.textContent = 'Busy')
		self.on('disconnected', e => this.textStatus.textContent = 'Disconnected')
		this.newText(' ')
		
		this.count = this.newElement('span')
		var s = 0
		var count = () => this.count.textContent = s == -1 ? '' : `${s++}s`
		var interval = null
		self.on('connected', e => { s = 1; interval = setInterval(count, 1000); count(); })
		self.on('deviceOk', e => { s = -1; clearInterval(interval); count(); })
		self.on('disconnected', e => { s = -1; clearInterval(interval); count(); })
		this.newText(' ')
		
		this.conStatus = this.newElement('status')
		this.conStatus.textContent = '●'
		self.on('connected', e => this.conStatus.classList.add('enabled'))
		self.on('disconnected', e => this.conStatus.classList.remove('enabled'))
		
		this.deviceStatus = this.newElement('status')
		this.deviceStatus.textContent = '●'
		self.on('deviceReady', e => this.deviceStatus.classList.add('enabled'))
		self.on('deviceNotReady', e => this.deviceStatus.classList.remove('enabled'))
		
		this.busyStatus = this.newElement('status')
		this.busyStatus.textContent = '●'
		self.on('deviceOk', e => this.busyStatus.classList.add('enabled'))
		self.on('deviceNotOk', e => this.busyStatus.classList.remove('enabled'))
	}
	
	readyCallback() {
		AppEvent('newPanel', { instance: this, position: 'bottom' })
		AppEvent('newPanel', { instance: this.bufferStatus, position: 'bottom' })
	}
}

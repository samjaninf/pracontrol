'use strict'

module.exports = class SerialBuffer extends WebComponentAbstract {
	initCallback() {
		
		this.buffer = []
		
		defineAppEvent('serialWrite', 'Send data to serial buffer', 'Serial buffer', "{ data: '' or [], prepend: false }")
		self.on('serialWrite', e => this.send(e.d.data, e.d.prepend))
		
		defineAppEvent('serialClean', 'Clean serial buffer', 'Serial buffer')
		self.on('serialClean', e => { this.buffer = []; AppEvent('bufferChange') })
		
		
		defineAppEvent('deviceReady', 'Device is communicating', 'Serial buffer')
		defineAppEvent('deviceNotReady', 'Device is not communicating', 'Serial buffer')
		this.deviceReady = false
		self.on('deviceReady', e => this.deviceReady = true)
		self.on('deviceNotReady', e => this.deviceReady = false)
		self.on('disconnected', e => AppEvent('deviceNotReady'))
		
		self.on('connected', e => AppEvent('serialDirectWrite', { data: "G4\n" }) )
		self.on('serialData', e => !this.deviceReady && AppEvent('deviceReady'))
		
		
		defineAppEvent('deviceOk', 'Device ok', 'Serial buffer')
		defineAppEvent('deviceNotOk', 'Device busy', 'Serial buffer')
		this.deviceOk = false
		self.on('deviceOk', e => this.deviceOk = true)
		self.on('deviceNotOk', e => this.deviceOk = false)
		self.on('disconnected', e => AppEvent('deviceNotOk'))
		
		self.on('deviceReady', e => AppEvent('deviceOk'))
		self.on('serialData', e => this.checkOk(e))
		self.on('deviceOk', e => setImmediate(e => this.sendBuffer()))
		
		
		defineAppEvent('deviceReset', 'Device was reseted', 'Serial buffer')
		this.deviceStarted = false
		self.on('disconnected', e => this.deviceStarted = false)
		
		self.on('serialData', e => this.checkReset(e))
		self.on('deviceReset', e => AppEvent('deviceReady'))
		self.on('deviceReset', e => AppEvent('info', { msg: "device was reseted" }))
	}
	
	readyCallback() {
		AppEvent('bufferChange')
	}
	
	checkReset(e) {
		if(e.d.data != "start\r") return
		if(this.deviceStarted) AppEvent('deviceReset')
		this.deviceStarted = true
	}
	
	checkOk(e) {
		if(!this.deviceReady) return;
		if(e.d.data.substr(0, 2) == "ok") AppEvent('deviceOk');
	}
	
	send(data, prepend) {
		if(Array.isArray(data)) {
			if(prepend) data.reverse()
			data.forEach(item => this.addToBuffer(item, prepend))
		} else {
			this.addToBuffer(data, prepend)
		}
		AppEvent('bufferChange')
		this.sendBuffer()
	}
	
	addToBuffer(data, prepend) {
		if(!data) return;
		prepend ? this.buffer.unshift(data + "\n") : this.buffer.push(data + "\n")
	}
	
	sendBuffer() {
		if(!this.deviceOk) return
		
		var data = this.buffer.shift()
		if(!data) return
		
		AppEvent('bufferChange')
		AppEvent('deviceNotOk')
		AppEvent('serialDirectWrite', { data: data })
	}
}

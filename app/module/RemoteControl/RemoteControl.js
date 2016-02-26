'use strict'

var http = require('http')
var fs = require('fs')

var style = `
:host {
	
}

::content iframe {
	border: 1px solid #EAEBEA;
	box-sizing: border-box;
	width: 100%;
	height: calc(100% - 2rem);
}
`

module.exports = class RemoteControl extends WebComponentAbstract {
	initCallback() {
		this.renderCss(style)
	 	
		defineAppEvent('remoteServerStart', 'Start remote server', 'Remote')
		self.on('remoteServerStart', e => this.serverStart())
		
		defineAppEvent('remoteServerStop', 'Stop remote server', 'Remote')
		self.on('remoteServerStop', e => this.serverStop())
		
		this.on('tabFocus', e => AppEvent('remoteServerStart'))
		
		this.port = 2222
		this.server = null
		this.serverRun = false
		
		this.info = this.newElement('p')
		this.iframe = this.newElement('iframe')
	}
	
	readyCallback() {
		AppEvent('newTab', { instance: this, title: 'Remote' })
		AppEvent('remoteServerStop')
	}
	
	serverStop() {
		this.server && this.server.close()
		this.serverRun = false
		this.info.textContent = "Server not running."
	}
	
	serverStart() {
		if(this.serverRun) return
		
		this.server = http.createServer(this.request.bind(this))
		this.server.listen(this.port, e => this.serverRun = true)
		
		var path = require('os').hostname() + ":" + this.port
		this.iframe.src = `http://${path}`
		this.info.textContent = `Server running at ${path}`;
	}
	
	request(req, res) {
		if(req.method == "GET") this.get(req, res)
		else if(req.method == "POST") this.post(req, res)
		
		res.end()
	}
	
	post(req, res) {
		var data = JSON.parse(req.headers['remote-data'])
		if('gcode' in data && data.gcode) {
			AppEvent('serialWrite', { data: data.gcode.split('|') })
		}
	}
	
	get(req, res) {
		res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
		res.write( fs.readFileSync(__dirname + '/client.html', 'utf8') );
	}
}

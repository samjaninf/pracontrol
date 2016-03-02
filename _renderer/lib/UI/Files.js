'use strict'

module.exports = class Files extends WebComponentAbstract {
	initCallback() {
		defineAppEvent('newFile', 'New file was dragged into app', 'Core', 'e.dataTransfer.files')
		self.on("drop", e => this.fileDrop(e))
		self.on("dragover", e => this.dragHover(e))
		self.on("dragleave", e => this.dragEnd(e))
	}
	
	dragHover(e) {
		document.body.classList.add('drag')
		e.preventDefault()
	}
	
	dragEnd(e) {
		document.body.classList.remove('drag')
		e.preventDefault()
	}
	
	fileDrop(e) {
		this.dragEnd(e)
		AppEvent('newFile', e.dataTransfer.files)
	}
}
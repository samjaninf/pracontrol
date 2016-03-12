'use strict'

var style = `
:host {
  
}

::content {
  button {
    display: block;
    height: 100%;
    width: 100%;
		font-size: 2em;
		color: #999;
		background: repeating-linear-gradient(
			-45deg,
			lighten(#000, 100%),
			lighten(#000, 100%) 9px,
			lighten(#000, 94%) 10px,
			lighten(#000, 97%) 11px,
			lighten(#000, 97%) 20px
		);
  }
}
`

module.exports = class NameOfYourModule extends WebComponentAbstract {
  initCallback() {
    // work here
    // do not dispatch events here
    this.renderLess(style)
    
    this.but = this.newElement('button')
    this.but.textContent = "Emergency stop"
    this.but.on('click', e => AppEvent('serialWrite', { data: 'M999', prepend: true }))
  }
  
  readyCallback() {
    // app is ready
    // fire events here
    
    // in this case we are going for new tab
    AppEvent('newTab', { instance: this, 'title': 'Example' })
  }
  
  attachedCallback() {
    // additional work
    // fired after element is attached to DOM
    
  }
}

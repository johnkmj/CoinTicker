'use strict';
const electron = require('electron');

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();
var menubar = require('menubar');
var Menu = require('menu');
var MenuItem = require('menu-item');
var dialog = require('dialog'); 

var mb = menubar({dir: __dirname, icon: 'not-castingTemplate.png'});

var mb = menubar()

function getCoinbasePrice() {
	// gets price from
	// https://api.exchange.coinbase.com/products/BTC-USD/trades?limit=1
	var req = new XMLHttpRequest();
	var url = "https://api.exchange.coinbase.com/products/BTC-USD/trades?limit=1"
  req.open( "GET", url, false );
  req.addEventListener( "load",function() {
  	if( req.status >= 200 && req.status < 403 ) {
  		var response = JSON.parse( req.responseText );
  		// finish this up
  	}

  	else {
  		console.log( "Error: " + req.statusText );
  	}
  });
}

mb.on('ready', function ready () {
  console.log('app is ready')
  // read http://electron.atom.io/docs/api/tray/
  // example in the tip below!
  // https://github.com/kevinsawicki/tray-example/blob/master/main.js
})

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createAboutWindow() {
	const win = new electron.BrowserWindow({
		width: 400,
		height: 400
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}
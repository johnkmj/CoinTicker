'use strict';
// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();
var unirest = require('unirest')

const {app, Tray, Menu, BrowserWindow, dialog} = require('electron')
const path = require('path')
const assetsDirectory = path.join(__dirname, 'assets')

var priceSource = Menu.buildFromTemplate([
  {label: 'Coinbase', type: 'radio', checked: true, click() { updatePrice() }},
  {label: 'Bitfinex', type: 'radio', click() { updatePrice() }},
  {label: 'Blockchain', type: 'radio', click() { updatePrice() }},
  {label: 'About', click() {
    dialog.showMessageBox({
      title: 'About',
      message: 'CoinTicker V1.0. Created by John Koh.',
      detail: 'https://github.com/johnthedong/CoinTicker',
      buttons: ["OK"] });
  }},
  {label: 'Quit', click() { app.quit() }}
]);

let tray = undefined;

app.dock.hide()

app.on('ready', () => {
  createTray();
  updatePrice();
});

const createTray = () => {
  console.log("Creating Tray Icon...")
  tray = new Tray(path.join(assetsDirectory, 'bitcoinTemplate.png'));
  tray.setTitle("Loading");
  tray.setContextMenu(priceSource);
}

// sets price in tray
const setPrice = (url, parse_arr) => {
  unirest.get(url)
  .end(function(res) {
    if (res.error) {
      console.log('GET error', res.error)
      tray.setTitle("Error")
    } else {
        var price = res.body;
        // parser that takes in an array of parsing labels and parses them.
        for (var i=0; i < parse_arr.length; i++) {
          price = price[parse_arr[i]]
        }
        tray.setTitle("$" + price.toString());
      }
    })
}


const updatePrice = () => {
  console.log("Updating price...")

  // checks which label is selected to determine the pricing source
  var tickerSource;
  for(var selected = 0; selected < 3; selected++) {
    if (priceSource.items[selected].checked) {
      tickerSource = priceSource.items[selected].label;
      break;
    }
  }

  console.log(`Getting bitcoin price from ${tickerSource}`)
  var price = "0";
  switch(tickerSource) {
    case "Coinbase":
      setPrice("https://api.coinbase.com/v2/prices/spot?currency=USD", ["data", "amount"]);
      break;
    case "Bitfinex":
      setPrice("https://api.bitfinex.com/v1/ticker/btcusd", ["last_price"])
      break;
    case "Blockchain":
      setPrice("https://blockchain.info/ticker", ["USD", "last"])
      break;
  }
}

const tenSeconds = 10 * 1000;
setInterval(updatePrice, tenSeconds)

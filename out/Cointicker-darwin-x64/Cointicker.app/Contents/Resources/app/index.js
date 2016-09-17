'use strict';
// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();
var unirest = require('unirest')

const {app, Tray, Menu} = require('electron')
const path = require('path')
const assetsDirectory = path.join(__dirname, 'assets')

var priceSource = Menu.buildFromTemplate([
  {label: 'Coinbase', type: 'radio', checked: true},
  {label: 'Bitfinex', type: 'radio'},
  {label: 'Blockchain', type: 'radio'},
  {label: 'Created by John Koh :)'}
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
        for (var i=0; i < parse_arr.length; i++) {
          price = price[parse_arr[i]]
        }
        tray.setTitle(price.toString());
      }
    })
}


const updatePrice = () => {
  // FIXME replace with your own API key
  // Register for one at https://developer.forecast.io/register
  // check which one is checked.
  console.log("Updating price...")

  var tickerSource;
  for(var selected = 0; selected < 3; selected++) {
    if (priceSource.items[selected].checked) {
      tickerSource = priceSource.items[selected].label;
      break;
    }
  }
  console.log(`Getting bitcoin price from ${tickerSource}`)
  var price = "$100";
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

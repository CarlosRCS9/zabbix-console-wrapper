'use strict';

require('dotenv').config();
const ZabbixSender = require('node-zabbix-sender');

const Sender = new ZabbixSender({
  host: process.env.ZABBIX_SERVER,
  items_host: process.env.ZABBIX_HOSTNAME,
});

const oldConsole = console;
const newConsole = Object.keys(oldConsole).reduce((newConsole, key) => {
  newConsole[key] = (...input) => {
    oldConsole[key](...input);
    Sender.addItem('console.' + key, JSON.stringify(input)).send();
  };
  return newConsole;
}, {});

console = newConsole;

exports.printMsg = () => {
  oldConsole.log("The console has been overloaded.");
}

module.exports = { Sender };


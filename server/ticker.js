const EventEmitter = require('events')
const autobahn = require('autobahn')
const wsuri = 'wss://api.poloniex.com'
const connection = new autobahn.Connection({
  url: wsuri,
  realm: 'realm1'
})

module.exports = class Ticker extends EventEmitter {
  constructor(currencyPair) {
    super()
    this.currencyPair = currencyPair

    // Setup handlers for the connection events
    connection.onopen = session => {
      this.emit('open')

      session.subscribe('ticker', args => {
        const [
          currencyPair,
          last,
          lowestAsk,
          highestBid,
          percentChange,
          baseVolume,
          quoteVolume,
          isFrozen,
          last24hrHigh,
          last24hrLow ] = args

        if (currencyPair !== this.currencyPair)
          return

        this.emit('ticker', {
          currencyPair,
          last,
          lowestAsk,
          highestBid,
          percentChange,
          baseVolume,
          quoteVolume,
          isFrozen,
          last24hrHigh,
          last24hrLow
        })
      })
    }

    connection.onclose = () => this.emit('close')

    connection.open()
  }
}

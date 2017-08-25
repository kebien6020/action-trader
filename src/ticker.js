const Poloniex = require('poloniex.js')
const EventEmitter = require('events')

const poloniex = new Poloniex()

class Ticker extends EventEmitter {
  constructor(currencyPairs, timeout) {
    super()
    this.currencyPairs = currencyPairs
    this.timeout = timeout

    this.start = this.start.bind(this)
    this.tick = this.tick.bind(this)
  }

  start() {
    setTimeout(this.tick, 0)
  }

  tick() {
    poloniex.returnTicker((error, data) => {
      if (error) {
        this.emit('error', error)
        setTimeout(this.tick, this.timeout)
        return
      }

      const entries = Object
        .keys(data)
        .map(key => [key, data[key]])

      for (const [currencyPair, tickerData] of entries)
        if (this.currencyPairs.indexOf(currencyPair) !== -1)
          this.emit('ticker', currencyPair, tickerData)

      setTimeout(this.tick, this.timeout)
    })
  }
}

module.exports = Ticker

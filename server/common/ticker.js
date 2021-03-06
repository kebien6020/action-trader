const Poloniex = require('poloniex.js')
const EventEmitter = require('events')

const poloniex = new Poloniex()

class Ticker extends EventEmitter {
  constructor(currencyPairs, timeout) {
    super()
    this.currencyPairs = currencyPairs
    this.timeout = timeout
    this.timer = null

    this.start = this.start.bind(this)
    this.tick = this.tick.bind(this)
  }

  start() {
    this.timer = setInterval(this.tick, this.timeout)
  }

  tick() {
    poloniex.returnTicker((error, data) => {
      if (error) {
        this.emit('error', error)
      } else {
        const entries = Object
          .keys(data)
          .map(key => [key, data[key]])

        for (const [currencyPair, tickerData] of entries)
          if (this.currencyPairs.indexOf(currencyPair) !== -1)
            this.emit('ticker', currencyPair, tickerData)

      }
    })
  }

  stop() {
    if (this.timer)
      clearInterval(this.timer)

    this.timer = null
  }
}

module.exports = Ticker

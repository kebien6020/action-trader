const EventEmitter = require('events')
const dgram = require('dgram')
const client = dgram.createSocket('udp4')

const PORT = 45454

module.exports = class Ticker extends EventEmitter {
  constructor() {
    super()


    client.bind({
      port: PORT
    })

    client.on('error', () => {
      console.log('Error intentando vincular el socket al puerto ' + PORT)
    })

    client.on('listening', () => {
      console.log('Escuchando en el puerto ' + PORT)
      this.emit('open')
    })

    client.on('message', (data) => {
      this.emit('ticker', {last: data.toString('utf8')})
    })
  }
}

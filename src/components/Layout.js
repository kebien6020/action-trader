import React, { Component } from 'react'
import SideNav from './SideNav'
import Ticker from '../common/ticker'

class Layout extends Component {
  state = {
    tickerPrice: null
  }

  ticker = null

  componentDidMount() {
    this.ticker = new Ticker(['USDT_BTC'], 1000)
    this.ticker.on('ticker', (_, {last}) => this.setState({tickerPrice: last}))
    this.ticker.on('error', () => {
      // There was some error while fetching the ticker
      // ignore and wait until next update
    })
    this.ticker.start()
  }

  componentWillUnmount() {
    this.ticker.stop()
    this.ticker = null
  }

  render() {
    const { props, state } = this
    let title = props.title || 'Action Trader'
    if (state.tickerPrice)
      title += ' - ' + state.tickerPrice
    return (
      <div>
        <SideNav
          menu={props.menu || null}
          title={title}
          goBackTo={props.goBackTo || null}
        />
        {props.children}
      </div>
    )
  }
}

export default Layout

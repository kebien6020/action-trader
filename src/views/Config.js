import React, { Component } from 'react'

class Config extends Component {
  componentWillMount() {
    this.props.onMount({menu: null})
  }
  
  render() {
    return (
      <h1>Config view</h1>
    )
  }
}

export default Config

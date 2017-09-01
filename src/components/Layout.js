import React from 'react'
import SideNav from './SideNav'

const Layout = (props) => (
  <div>
    <SideNav
      menu={props.menu || null}
      title={props.title || 'Action Trader'}
      goBackTo={props.goBackTo || null}
    />
    {props.children}
  </div>
)

export default Layout

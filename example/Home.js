import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class Home extends Component {

  render() {

    return (
      <div>
        <p><Link to="/products">Products</Link></p>
        <p><Link to="/store">Store</Link></p>
      </div>
    )
  }

}

export default Home
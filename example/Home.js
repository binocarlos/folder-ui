import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'


class Home extends Component {

  render() {

    return (
      <div>
        <p>
          <Link to="/about">About</Link>
        </p>
        <p>
          <Link to="/folders">Folders</Link>
        </p>
      </div>
    )
  }

}

export default Home
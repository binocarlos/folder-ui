import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'


class About extends Component {

  render() {

    return (
      <div>
        <p>
          The about page
        </p>
        <p>
          <Link to="/">Home</Link>
        </p>
      </div>
    )
  }

}

export default About
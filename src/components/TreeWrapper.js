import React, { Component, PropTypes } from 'react'
import NavWrapper from 'kettle-ui/lib/NavWrapper'

class TreeWrapper extends Component {

  render() {

    const { main, sidebar } = this.props

    return (
      <NavWrapper
        width={this.props.width || 200}
        paperprops={{
          zDepth:1,
          rounded:false
        }}
        navbar={sidebar}
        >
        
        {main}

      </NavWrapper>
    )
  }

}

export default TreeWrapper
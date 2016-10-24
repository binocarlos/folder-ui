import React, { Component, PropTypes } from 'react'
import AppWrapper from 'kettle-ui/lib/AppWrapper'
import AppBar from 'material-ui/AppBar'

class Wrapper extends Component {

  render() {

    return (
      <AppWrapper
        appbar={
          <AppBar
            showMenuIconButton={false}
            title="Home"
            zDepth={2} />
        }>
        
        {this.props.children}
        
      </AppWrapper>
    )
  }

}

export default Wrapper
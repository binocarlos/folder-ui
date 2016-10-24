import React, { Component, PropTypes } from 'react'
import FolderToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

class ToolbarWrapper extends Component {

  render() {

    const { main, toolbar } = this.props

    return (
      <FolderToolbarWrapper
        offsetWidth={this.props.offsetWidth}
        toolbar={toolbar}
        >

        {main}

      </FolderToolbarWrapper>
    )
  }

}

export default ToolbarWrapper
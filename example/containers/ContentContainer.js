import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import { table_select_nodes } from '../actions'
import ChildrenContainer from './ChildrenContainer'
import ChildrenToolbarContainer from './ChildrenToolbarContainer'
import FormContainer from './FormContainer'
import FormToolbarContainer from './FormToolbarContainer'

export class ContentContainer extends Component {

  render() {

    var ToolbarType = this.props.mode=='form' ? FormToolbarContainer : ChildrenToolbarContainer
    var ContentType = this.props.mode=='form' ? FormContainer : ChildrenContainer

    return (
      <ToolbarWrapper
        offsetWidth={this.props.offsetWidth}
        toolbar={<ToolbarType />}>

        <ContentType {...this.props} />

      </ToolbarWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    mode:state.folderui.editing ? 'form' : 'children'
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)
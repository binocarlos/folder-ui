import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import { table_select_nodes } from '../actions'
import ChildrenContainer from './ChildrenContainer'
import FormContainer from './FormContainer'


export class ContentContainer extends Component {

  render() {

    var ContentType = this.props.mode=='form' ? FormContainer : ChildrenContainer

    return (
      <ContentType {...this.props} />
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
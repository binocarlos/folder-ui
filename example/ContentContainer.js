import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { tree_select_node } from './actions'
import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'
import TableContainer from './TableContainer'
import FormContainer from './FormContainer'
import FolderToolbar from './FolderToolbar'

export class ContentContainer extends Component {
  render() {
    return this.props.page=='table' ?
      (
        <ToolbarWrapper
          toolbar={
            <FolderToolbar />
          }
        >
          <TableContainer />
        </ToolbarWrapper>
      ) :
      (
        <FormContainer />
      )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    page:state.page
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

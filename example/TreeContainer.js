import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { expandstateupdate } from './actions'
import TreeViewer from '../src/components/TreeViewer'

export class TreeContainer extends Component {

  render() {
    return (
      <TreeViewer {...this.props} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    expand_state:state.tree.expandstate
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    update_expand_state:function(data){
      dispatch(expandstateupdate(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeContainer)

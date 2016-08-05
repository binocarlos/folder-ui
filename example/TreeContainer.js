import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { update_expandstate } from './actions'
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
    expandstate:state.tree.expandstate,
    data:state.tree.data
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    update_expandstate:function(data){
      dispatch(update_expandstate(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeContainer)

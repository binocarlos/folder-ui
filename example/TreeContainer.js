import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { update_tree_meta } from './actions'
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
    meta:state.tree.meta,
    data:state.tree.data
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    update_meta:function(meta){
      dispatch(update_tree_meta(meta))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeContainer)

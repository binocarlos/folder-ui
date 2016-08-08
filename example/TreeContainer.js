import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { tree_select_node } from './actions'
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
    data:state.tree.data
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    select_node:function(data){
      dispatch(tree_select_node(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeContainer)

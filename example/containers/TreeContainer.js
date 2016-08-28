import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { tree_select_node } from '../actions'
import TreeViewer from '../../src/TreeViewer'

export class TreeContainer extends Component {
  render() {
    return (    
      <TreeViewer {...this.props} />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {  
    treedata:state.folderui.tree,
    selected:state.folderui.treeselected
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    selectNode:function(data){
      dispatch(tree_select_node(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeContainer)

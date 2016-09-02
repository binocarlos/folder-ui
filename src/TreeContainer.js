import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  api_load_tree_data,
  api_select_node
} from './actions'

import TreeViewer from './TreeViewer'

export class TreeContainer extends Component {

  componentDidMount() {
    if(!this.props.treedata){
      this.props.requestTreeData()
    }
  }

  render() {
    return (    
      <TreeViewer {...this.props} />
    )
  }
}

function mapStateToProps(state, ownProps) {

  let reducername = ownProps.reducername || 'folderui'

  return {  
    treedata:state[reducername].tree,
    selected:state[reducername].treeselected
  }
}

function mapDispatchToProps(dispatch, ownProps) {

  return {
    selectNode:(item) => {
      dispatch(api_select_node(ownProps, item))
    },
    requestTreeData:() => {
      dispatch(api_load_tree_data(ownProps))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeContainer)

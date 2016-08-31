import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { 
  tree_select_node,
  tree_data_loaded,
  table_data_loaded,
  snackbar_open
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

  function loadTreeData(done){
    ownProps.loadTree && ownProps.loadTree(done)
  }

  function loadChildren(item, done){
    ownProps.loadChildren && ownProps.loadChildren(item, done)
  }

  return {
    selectNode:(data) => {
      dispatch((dispatch, getState) => {

        // tell the tree structure this item is open
        dispatch(tree_select_node(data))

        // load the children for the item
        loadChildren(data, (err, children) => {
          if(err) return dispatch(snackbar_open('loadChildren error: ' + err.toString()))
          dispatch(table_data_loaded(children))
        })
      })
    },
    requestTreeData:() => {
      dispatch((dispatch, getState) => {

        // call the external function to get the tree data
        loadTreeData((err, treedata) => {
          if(err) return dispatch(snackbar_open('loadTreeData error: ' + err.toString()))
          dispatch(tree_data_loaded(treedata))
          // call the external function to get the children
          // for the first element in the tree data
          loadChildren(treedata[0], (err, children) => {
            if(err) return dispatch(snackbar_open('loadChildren error: ' + err.toString()))
            dispatch(table_data_loaded(children))
          })
        })
        
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeContainer)

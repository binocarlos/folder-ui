import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  api_load_tree_data,
  api_select_node
} from './actions'

import TreeViewer from './TreeViewer'

export class TreeContainer extends Component {

  componentDidMount() {

    // first check that we have some tree data
    if(!this.props.treedata){
      let selectid = this.props.currentView ? this.props.currentView.id : null
      this.props.requestTreeData(selectid)
      return
    }
  }

  componentWillReceiveProps(nextProps) {

    // now check the currentView properties against the state
    if(nextProps.currentView && this.props.selected){
      let currentViewID = nextProps.currentView.id
      let currentTreeID = this.props.selected.id

      if(currentViewID!=currentTreeID){
        let newItem = this.props.treedata.data[currentViewID]
        this.props.selectNode(newItem, true)
      }
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
    selectNode:(item, force) => {

      // we have some route handling looking after this
      if(ownProps.updateView && !force){
        ownProps.updateView({
          view:'children',
          id:item.id
        })
      }
      else{
        dispatch(api_select_node(ownProps, item))  
      }
      
    },
    requestTreeData:(selectid) => {
      dispatch(api_load_tree_data(ownProps, selectid))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeContainer)

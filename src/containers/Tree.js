import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import Tree from '../components/Tree'
import { dumpTreeData, getAncestors } from '../tools'

export class TreeContainer extends Component {

  componentDidMount() {

    // the initial bootstrap
    // first load the tree data
    this.props.requestTreeData((err, tree) => {
      if(err) return

      // now check if we have a selected id from the url
      // or pick the first root node
      const selected = this.props.selected ? tree.data[this.props.selected] : tree.data[tree.rootids[0]]

      // open the ancestors of the selected node
      this.props.openAncestors(selected.id)

      // now select it - this will redirect and open the node
      this.props.selectNode(selected)
    })
  }
  
  componentWillReceiveProps(nextProps) {
    if(!nextProps.selected){
      this.props.selectNode(nextProps.data[0]) 
    }
  }

  render() {
    return (    
      <Tree {...this.props} />
    )
  }
}

function mapStateToProps(s, ownProps) {
  const actions = ownProps.actions
  const state = actions.getState(s)

  const data = state.tree.db ? dumpTreeData(state.tree.db) : []
  const open = state.tree.open || {}
  const selected = ownProps.params.id

  return {
    // the tree structure data
    data,
    // object of ids -> open state
    open,
    // the id of the currently selected node (comes from the url)
    selected
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  const handlers = ownProps.handlers || {}
  const route = ownProps.route || {}

  return {
    requestTreeData:(done) => {
      dispatch(actions.requestTreeData(done))
    },
    selectNode:(node) => {
      dispatch(actions.toggleTreeNode(node.id, true))
      dispatch(actions.selectTreeNode(node))
      if(!handlers.open) return
      const url = [route.path, handlers.open(node)].filter(s => s).join('/')
      dispatch(push('/' + url))
    },
    toggleNode:(node) => {
      dispatch(actions.toggleTreeNode(node.id))
    },
    // open ancestors after the initial page load
    openAncestors:(id) => {
      dispatch((dispatch, getState) => {
        const state = actions.getState(getState())
        getAncestors(state.tree.db, id).forEach((ancestor) => {
          dispatch(actions.toggleTreeNode(ancestor.id, true))
        })
      })
    }
  }
}

TreeContainer.propTypes = {
  actions:React.PropTypes.object.isRequired,
  handlers:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TreeContainer))

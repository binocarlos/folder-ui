import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Tree from '../components/Tree'
import { dumpTreeData, getAncestors, getDatabaseContext } from '../tools'

export class TreeContainer extends Component {

  componentDidMount() {

    // the initial bootstrap
    // first load the tree data
    this.props.requestTreeData((err, tree) => {
      if(err) return

      // activate the selected node
      if(this.props.selected && tree.data[this.props.selected]){
        this.props.activateNode(tree.data[this.props.selected])
      }
      // redirect to the first root node
      else {
        this.props.selectNode(tree.data[tree.rootids[0]])
      }
    })
  }
  
  componentWillReceiveProps(nextProps) {
    if(!nextProps.selectedNode) return

    // activate the selected node on first load
    if(nextProps.selected!=this.props.selected){
      this.props.activateNode(nextProps.selectedNode)
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
  const info = ownProps.info
  const state = actions.getState(s)

  const data = state.tree.db ? dumpTreeData(state.tree.db) : []
  const open = state.tree.open || {}
  const treeInfo = info.tree ? info.tree(ownProps.params) : {
    id:ownProps.params.id
  }
  const selected = treeInfo.id
  const selectedNode = state.tree.db ? state.tree.db.data[selected] : null

  return {
    // the tree structure data
    data,
    // object of ids -> open state
    open,
    // the id of the currently selected node (comes from the url)
    selected,
    selectedNode
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  const context = getDatabaseContext(ownProps)
  const params = ownProps.params
  const route = ownProps.route || {}

  return {
    requestTreeData:(done) => {
      dispatch(actions.requestTreeData(context, done))
    },
    activateNode:(node) => {
      dispatch((dispatch, getState) => {
        dispatch(actions.toggleTreeNode(node.id, true))
        const state = actions.getState(getState())
        getAncestors(state.tree.db, node.id).forEach((ancestor) => {
          dispatch(actions.toggleTreeNode(ancestor.id, true))
        })
      })
    },
    selectNode:(node) => {
      dispatch(actions.routeOpen(node, params))
    },
    toggleNode:(node) => {
      dispatch(actions.toggleTreeNode(node.id))
    }
  }
}

TreeContainer.propTypes = {
  actions:React.PropTypes.object.isRequired,
  info:React.PropTypes.object.isRequired,
  handlers:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TreeContainer))

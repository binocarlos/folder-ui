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

      // redirect to the first root node
      if(!this.props.selected){
        this.props.selectNode(tree.data[tree.rootids[0]])
      }
      // activate the selected node
      else {
        this.props.activateNode(tree.data[this.props.selected])
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
  const state = actions.getState(s)

  const data = state.tree.db ? dumpTreeData(state.tree.db) : []
  const open = state.tree.open || {}
  const selected = ownProps.params.id
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
  const handlers = ownProps.handlers || {}
  const route = ownProps.route || {}

  return {
    requestTreeData:(done) => {
      dispatch(actions.requestTreeData(done))
    },
    activateNode:(node) => {
      dispatch((dispatch, getState) => {
        dispatch(actions.toggleTreeNode(node.id, true))
        dispatch(actions.selectTreeNode(node))
        const state = actions.getState(getState())
        getAncestors(state.tree.db, node.id).forEach((ancestor) => {
          dispatch(actions.toggleTreeNode(ancestor.id, true))
        })
      })
    },
    selectNode:(node) => {
      if(!handlers.open) return
      const url = [route.path, handlers.open(node)].filter(s => s).join('/')
      dispatch(push('/' + url))
    },
    toggleNode:(node) => {
      dispatch(actions.toggleTreeNode(node.id))
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

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import Tree from '../components/Tree'
import { dumpTreeData, getAncestors } from '../tools'

export class TreeContainer extends Component {

  componentDidMount() {
    this.props.requestTreeData((err, data) => {
      this.props.openAncestors(getSelectedId(this.props.selected, data))
    })
  }

  render() {
    return (    
      <Tree {...this.props} />
    )
  }
}

function getSelectedId(selected, data){
  return selected || (data[0] ? data[0].id : null)
}

function mapStateToProps(s, ownProps) {
  const actions = ownProps.actions
  const state = actions.getState(s)

  const data = state.tree.db ? dumpTreeData(state.tree.db) : []
  const open = state.tree.open || {}
  const selected = getSelectedId(ownProps.params.id, data)

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
      if(!handlers.open) return
      const url = [route.path, handlers.open(node)].filter(s => s).join('/')
      dispatch(actions.toggleTreeNode(node.id, true))
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
        dispatch(actions.toggleTreeNode(id, true))
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

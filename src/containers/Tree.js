import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import Tree from '../components/Tree'
import { dumpTreeData } from '../tools'

export class TreeContainer extends Component {

  componentDidMount() {
    this.props.requestTreeData()
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
  const open = state.tree.open || {}
  const data = state.tree.db ? dumpTreeData(state.tree.db) : []
  let selected = ownProps.params.id

  selected = !selected && data[0] ? data[0].id : selected

  return {
    data,
    open,
    selected
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  const handlers = ownProps.handlers || {}
  const route = ownProps.route || {}

  return {
    requestTreeData:() => {
      dispatch(actions.requestTreeData())
    },
    selectNode:(node) => {
      if(!handlers.open) return
      const url = [route.path, handlers.open(node)].filter(s => s).join('/')
      dispatch(push('/' + url))
    },
    toggleNode:(node) => {
      dispatch(actions.toggleTreeNode(node.id))
    },
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

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import Tree from '../components/Tree'
import { dumpTreeData, getAncestors } from '../tools'

export class TreeContainer extends Component {

  componentDidMount() {
    this.props.requestTreeData()
  }

  componentWillReceiveProps(nextProps) {
    nextProps.openNodes.forEach((node) => {
      this.props.toggleNode(node)
    })
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
  let open = Object.assign({}, state.tree.open || {})
  let selected = ownProps.params.id

  // if we need to open ancestors
  let openNodes = []

  // select the root node if nothing is on the url
  if(!selected && data[0]){
    selected = data[0].id
    open[data[0].id] = true
  }
  // open all ancestors for the selected node
  else if(selected && state.tree.db){
    getAncestors(state.tree.db, selected).forEach((ancestor) => {
      if(!open[ancestor.id]){
        openNodes.push(ancestor)
      }
      open[ancestor.id] = true
    })

    // also open the currently selected node
    if(!open[selected]){
      openNodes.push(state.tree.db.data[selected])
      open[selected] = true
    }
  }

  return {
    data,
    open,
    selected,
    openNodes
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

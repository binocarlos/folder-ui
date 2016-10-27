import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import ChildrenToolbar from '../components/ChildrenToolbar'

export class ChildrenToolbarContainer extends Component {
  render() {
    return (    
      <ChildrenToolbar {...this.props} />
    )
  }
}

function mapStateToProps(s, ownProps) {
  const actions = ownProps.actions
  const state = actions.getState(s)
  const children = state.children.data || []
  const clipboard = state.clipboard || []
  const selected = children.filter((node) => {
    return state.children.selected[node.id]
  })
  const title = selected.length == 0 ?
    (state.parent || {}).name :
    (
      selected.length == 1 ? 
        selected[0].name :
        selected.length + ' items'
    )
  
  return {
    title,
    node:state.parent,
    data:children,
    selected,
    clipboard,
    isLeaf:() => true
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onAdd:(decriptor) => {

    },
    onEdit:(node) => {

    },
    onPaste:(nodes) => {

    },
    onOpen:(node) => {

    },
    onDelete:(nodes) => {

    },
    onCopy:(nodes) => {

    },
    onCut:(nodes) => {

    }
  }
}

ChildrenToolbarContainer.propTypes = {
  actions:React.PropTypes.object.isRequired,
  routeInfo:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChildrenToolbarContainer))

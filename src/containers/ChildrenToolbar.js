import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
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
  const info = ownProps.info
  const state = actions.getState(s)

  const formInfo = info.tree ? info.tree(ownProps) : {}

  const children = state.children.data || []
  const deleting = state.children.deleting ? true : false
  const message = state.children.message
  const clipboard = state.clipboard.data || []
  const clipboardMode = state.clipboard.mode
  const selected = children.filter((node) => {
    return state.children.selected[node.id]
  })
  const parentNode = state.tree.db ? state.tree.db.data[formInfo.id] : null
  const title = selected.length == 0 ?
    (parentNode || {}).name :
    (
      selected.length == 1 ? 
        selected[0].name :
        selected.length + ' items'
    )
  
  return {
    title,
    node:parentNode,
    data:children,
    selected,
    clipboard,
    clipboardMode,
    deleting,
    message
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  const handlers = ownProps.handlers
  return {
    onAdd:(parent, decriptor) => {
      if(!handlers.add || !parent || !decriptor) return
      dispatch(push(handlers.add(parent, decriptor)))
    },
    onEdit:(parent, node) => {
      if(!handlers.edit || !parent) return
      dispatch(push(handlers.edit(parent, node)))
    },
    onOpen:(node) => {
      if(!handlers.open && !node) return
      dispatch(push(handlers.open(node)))
    },
    onDelete:(nodes) => {
      dispatch(actions.deleteSelection())
    },
    onCopy:(nodes) => {
      dispatch(actions.setClipboard('copy', nodes))
      dispatch(actions.showChildrenMessage('copied ' + nodes.length + ' item' + (nodes.length==1?'':'s') + ' to the clipboard'))
    },
    onCut:(nodes) => {
      dispatch(actions.setClipboard('cut', nodes))
      dispatch(actions.showChildrenMessage('cut ' + nodes.length + ' item' + (nodes.length==1?'':'s') + ' to the clipboard'))
    },
    onPaste:(parent, mode, nodes) => { 
      dispatch(actions.requestPasteItems(parent, mode, nodes, (err) => {
        if(err){
          // TODO show an error message
        }
        else{
          dispatch(actions.setClipboard(null, []))
          dispatch(actions.showChildrenMessage(nodes.length + ' item' + (nodes.length==1?'':'s') + ' ' + (mode=='copy' ? ' copied' : 'cut') + ' to ' + parent.name))
        }
      }))
    },
    onConfirmDelete:(parent, nodes) => {
      dispatch(actions.requestDeleteNodes(parent.id, nodes.map((node) => node.id), (err) => {
        if(err){
          // TODO show an error message
        }
        else{
          dispatch(actions.showChildrenMessage(nodes.length + ' item' + (nodes.length==1?'':'s') + ' deleted'))
          dispatch(actions.cancelDeleteSelection())
        }
      }))
    },
    onCancelDelete:() => {
      dispatch(actions.cancelDeleteSelection())
    },
    onCloseMessage:() => {
      dispatch(actions.showChildrenMessage(null))
    }

  }
}

ChildrenToolbarContainer.propTypes = {
  actions:React.PropTypes.object.isRequired,
  info:React.PropTypes.object.isRequired,
  handlers:React.PropTypes.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ChildrenToolbarContainer))

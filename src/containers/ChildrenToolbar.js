import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import ChildrenToolbar from '../components/ChildrenToolbar'
import { getDatabaseContext } from '../tools'

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

  const formInfo = info.tree ? info.tree(ownProps.params) : {}

  const children = state.children.data || []
  const deleting = state.children.deleting ? true : false
  const message = state.children.message
  const clipboard = state.clipboard.data || []
  const clipboardMode = state.clipboard.mode
  const selected = children.filter((node) => {
    return state.children.selected[node.id]
  })
  let parentNode = state.tree.db ? state.tree.db.data[formInfo.id] : null
  let parentId = formInfo.id

  if(ownProps.crudParent){
    parentNode = ownProps.crudParent
    parentId = parentNode.id
  }

  const getItemTitle = (item = {}) => {
    const name = item ? item.name : ''
    return ownProps.getTitle && item ?
      ownProps.getTitle(item) :
      name
  }

  let title = ''

  if(selected.length==0){
    title = getItemTitle(parentNode)
  }
  else if(selected.length==1){
    title = getItemTitle(selected[0])
  }
  else{
    title = selected.length + ' items' 
  }

  return {
    title,
    node:parentNode,
    parentId:parentId,
    data:children,
    selected,
    clipboard,
    clipboardMode,
    deleting,
    message,
    getState:() => s
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = ownProps.actions
  const context = getDatabaseContext(ownProps)
  const params = ownProps.params
  
  return {
    dispatch,
    onAdd:(parent, descriptor) => {
      dispatch(actions.routeAdd(parent, descriptor, params))
    },
    onEdit:(parent, node) => {
      dispatch(actions.routeEdit(parent, node, params))
    },
    onOpen:(node) => {
      dispatch(actions.routeOpen(node, params))
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
      dispatch(actions.requestPasteItems(context, parent, mode, nodes, (err) => {
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
      dispatch(actions.requestDeleteNodes(context, parent.id, nodes.map((node) => node.id), (err) => {
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

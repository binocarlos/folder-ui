import React, { Component, PropTypes } from 'react'
import Toolbar from 'kettle-ui/lib/Toolbar'

export default class ChildrenToolbar extends Component {

  getAddButton() {
    return {
      id:'add',
      type:'dropdown',
      title:'Add',
      items:[{
        type:'folder',
        title:'Folder'
      },{
        type:'item',
        title:'Item'
      }]
    }
  }

  getLeftButtons() {
    let actions = []
    let leftbuttons = []

    const selected = this.props.selected || []

    if(selected.length==0){
      let addButton = getAddButton(parent)
      leftbuttons.push(addButton)
      actions.push({
        id:'edit',
        title:'Edit',
        handler:() => {
          this.props.onEdit && this.props.onEdit(parent)
        }
      })

      if(clipboard.length>0){
        actions.push({
          id:'paste',
          title:'Paste',
          handler:() => {
            this.props.onPaste && this.props.onPaste(clipboard)
          }
        })
      }
    }
    else if(selected.length==1){

      let canOpen = true

      canOpen = this.props.isLeaf ? !this.props.isLeaf(selected[0]) : canOpen
      // lets check that we can open the single item
      if(canOpen){
        actions.push({
          id:'open',
          title:'Open',
          handler:() => {
            this.props.onOpen && this.props.onOpen(selected[0])
          }
        })
      }

      actions.push({
        id:'edit',
        title:'Edit',
        handler:() => {
          this.props.onEdit && this.props.onEdit(parent)
        }
      })

    }
   
    if(selected.length>0){
      actions.push({
        id:'delete',
        title:'Delete',
        handler:() => {
          this.props.onDelete && this.props.onDelete(selected)
        }
      },{
        divider:true
      },{
        id:'copy',
        title:'Copy',
        handler:() => {
          this.props.onCopy && this.props.onCopy(selected)
        }
      },{
        id:'cut',
        title:'Cut',
        handler:() => {
          this.props.onCut && this.props.onCut(selected)
        }
      })
    }

    if(actions.length>0){
      leftbuttons.push({
        id:'actions',
        type:'dropdown',
        title:'Actions',
        items:actions
      })
    }

    return leftbuttons
  }

  render() {

    return (
      <div>children toolbar</div>
    )
  }

}
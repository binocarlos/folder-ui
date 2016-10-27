import React, { Component, PropTypes } from 'react'
import Toolbar from 'kettle-ui/lib/Toolbar'

export default class ChildrenToolbar extends Component {

  getAddButton(parent) {
    return {
      id:'add',
      type:'dropdown',
      title:'Add',
      items:this.props.getChildTypes(parent).map((item) => {
        return Object.assign({}, item, {
          handler:() => {
            this.props.onAdd(this.props.node, item)
          }
        })
      })
        
    }
  }

  getLeftButtons() {
    let actions = []
    let leftbuttons = []

    const selected = this.props.selected || []

    if(selected.length==0){
      let addButton = this.getAddButton(this.props.node)
      leftbuttons.push(addButton)
      actions.push({
        id:'edit',
        title:'Edit',
        handler:() => {
          this.props.onEdit && this.props.onEdit(this.props.node)
        }
      })

      if(this.props.clipboard.length>0){
        actions.push({
          id:'paste',
          title:'Paste',
          handler:() => {
            this.props.onPaste && this.props.onPaste(this.props.clipboard)
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
          this.props.onEdit && this.props.onEdit(parent, selected[0])
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

    const newProps = Object.assign({}, this.props, {
      leftbuttons:this.getLeftButtons()
    })
    return (
      <Toolbar {...newProps} />
    )
  }

}
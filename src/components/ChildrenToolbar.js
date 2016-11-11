import React, { Component, PropTypes } from 'react'
import Toolbar from 'kettle-ui/lib/Toolbar'
import ConfirmDialog from 'kettle-ui/lib/ConfirmDialog'
import muiThemeable from 'material-ui/styles/muiThemeable'
import Snackbar from 'material-ui/Snackbar'

const SNACKBAR_AUTOHIDE = 5000

const nameSort = (a, b) => {
  if (a.title < b.title) return -1;
  if (a.title > b.title) return 1;
  return 0;
}

class ChildrenToolbar extends Component {

  getAddButton(parent) {

    if(this.props.isEditable && !this.props.isEditable(parent)) return null

    let items = this.props.getDescriptors ?
      this.props.getDescriptors(parent).map((item) => {
        return Object.assign({}, item, {
          handler:() => {
            this.props.onAdd(this.props.node, item)
          }
        })
      }) :
      []

    items = items.sort(nameSort)

    return {
      id:'add',
      type:'dropdown',
      title:'Add',
      items
    }
  }

  getLeftButtons() {
    let actions = []
    let leftbuttons = []

    const selected = this.props.selected || []

    if(selected.length==0){
      let addButton = this.getAddButton(this.props.node)
      if(addButton) leftbuttons.push(addButton)
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
            this.props.onPaste && this.props.onPaste(this.props.node, this.props.clipboardMode, this.props.clipboard)
          }
        })
      }
    }
    else if(selected.length==1){

      actions.push({
        id:'open',
        title:'Open',
        handler:() => {
          this.props.onOpen && this.props.onOpen(selected[0])
        }
      })

      actions.push({
        id:'edit',
        title:'Edit',
        handler:() => {
          this.props.onEdit && this.props.onEdit(this.props.node, selected[0])
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

    actions = this.props.filterActions ? 
      actions = this.props.filterActions(this.getContext(), actions) :
      actions

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

  // the info we pass to functions
  getContext() {
    return {
      parent:this.props.node,
      selected:this.props.selected,
      clipboard:this.props.clipboard,
      clipboardMode:this.props.clipboardMode,
      getState:this.props.getState,
      dispatch:this.props.dispatch,
      actions:this.props.actions,
      params:this.props.params
    }
  }

  render() {

    const toolbarChildren = this.props.getChildren ? 
      this.props.getChildren(this.getContext()) : 
      null

    let icon = this.props.getIcon && this.props.node && this.props.selected.length == 0 ?
      this.props.getIcon(this.props.node, 'toolbar', this.props.muiTheme) :
      null

    if(this.props.selected.length==1){
      icon = this.props.getIcon(this.props.selected[0], 'toolbar', this.props.muiTheme)
    }

    const newProps = Object.assign({}, this.props, {
      leftbuttons:this.getLeftButtons(),
      icon
    })

    const selected = this.props.selected || []

    return (
      <div>
        <Toolbar {...newProps}>
          {toolbarChildren}
        </Toolbar>
        {
          this.props.deleting ? 
            (
              <ConfirmDialog
                confirmTitle="Delete"
                isOpen={true}
                isModal={true}
                onConfirm={() => {
                  this.props.onConfirmDelete(this.props.node, this.props.selected || [])
                }}
                onClose={this.props.onCancelDelete}
                >
                Are you sure you want to delete {this.props.selected.length} item{this.props.selected.length==1 ? '' : 's'}?
              </ConfirmDialog>
            ) : null
        }
        {
          this.props.message ? 
            (
              <Snackbar 
                open={true}
                message={this.props.message}
                autoHideDuration={SNACKBAR_AUTOHIDE}
                onRequestClose={this.props.onCloseMessage} />
            ) : null
        }
      </div>
    )
  }

}

export default muiThemeable()(ChildrenToolbar)
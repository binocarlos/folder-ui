import React, { Component, PropTypes } from 'react'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import BaseToolbar from './BaseToolbar'

const STYLES = {
  button:{  
    margin:'10px'
  },
  leftSeperator:{
    width:'25px',
    display:'inline-block'
  }
}
 
export default class ViewToolbar extends BaseToolbar {

  render() {

    var displayMap = {
      title:this.props.title,
      add:this.props.selected.length<=0 &&
          this.props.additems.length>0 &&
          !this.props.disable.add,
      rightmenu:this.props.rightitems.length>0 &&
          !this.props.disable.rightmenu,
      open:this.props.selected.length==1 &&
          !this.props.disable.open,
      edit:this.props.selected.length==1 &&
          !this.props.disable.edit,
      delete:this.props.selected.length>0 &&
           !this.props.disable.delete,
      cut:this.props.selected.length>0 &&
           !this.props.disable.cut,
      copy:this.props.selected.length>0 &&
           !this.props.disable.copy,
      paste:this.props.selected.length==0 &&
           !this.props.disable.paste
    }

    return (
      <Toolbar>
        <ToolbarGroup>
          {
            displayMap.title ? (
              <ToolbarTitle text={this.props.title} />
            ) : null
          }
          {
            displayMap.title ? (
              <ToolbarSeparator />
            ) : null
          }

          <div style={STYLES.leftSeperator}></div>
          
          {
            displayMap.add ? (
              this.getButtonDropdown('Add', this.props.additems, item => {
                this.props.onadd(item)
              })
            ) : null
          }

          {
            displayMap.open ? (
              this.getButton('Open', () => {
                this.props.onbutton('open', this.props.selected)
              })
            ) : null
          }
          {
            displayMap.edit ? (
              this.getButton('Edit', () => {
                this.props.onbutton('edit', this.props.selected)
              })
            ) : null
          }
          {
            displayMap.delete ? (
              this.getButton('Delete', () => {
                this.props.onbutton('delete', this.props.selected)
              })
            ) : null
          }
          <ToolbarSeparator />
          <div style={STYLES.leftSeperator}></div>
          {
            displayMap.cut ? (
              this.getButton('Cut', () => {
                this.props.onbutton('cut', this.props.selected)
              })
            ) : null
          }
          {
            displayMap.copy ? (
              this.getButton('Copy', () => {
                this.props.onbutton('copy', this.props.selected)
              })
            ) : null
          }
          {
            displayMap.paste ? (
              this.getButton('Paste', () => {
                this.props.onbutton('paste', this.props.selected)
              })
            ) : null
          }
          {
            this.props.children
          }
        
        </ToolbarGroup>

        <ToolbarGroup>
          {
            this.props.rightchildren
          }
          {
            displayMap.rightmenu ? (
              this.getIconDropdown(null, this.props.rightitems, item => {
                this.props.onrightmenu(item)
              })
            ) : null
          }
        </ToolbarGroup>
        
        
        
      </Toolbar>
    )
  }
}

ViewToolbar.propTypes = {
  title: PropTypes.string,
  selected: PropTypes.array,
  additems: PropTypes.array,
  viewitems: PropTypes.array,
  onadd: PropTypes.func,
  onview: PropTypes.func,
  onopen: PropTypes.func,
  ondelete: PropTypes.func,
  onedit: PropTypes.func,
  disable: PropTypes.object
}

ViewToolbar.defaultProps = {
  selected: [],
  additems: [],
  viewitems: [],
  disable: {}
}
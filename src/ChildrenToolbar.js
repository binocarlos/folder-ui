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
 
class ChildrenToolbar extends BaseToolbar {

  render() {

    var buttonFilter = this.props.buttonFilter || function(name, props){
      return true
    }

    var displayMap = {
      title:this.props.title,
      add:this.props.selected.length<=0 &&
          this.props.additems.length>0 &&
          !this.props.disable.add &&
          buttonFilter('add', this.props),
      rightmenu:this.props.rightitems.length>0 &&
          !this.props.disable.rightmenu &&
          buttonFilter('rightmenu', this.props),
      open:this.props.selected.length==1 &&
          !this.props.disable.open &&
          buttonFilter('open', this.props),
      edit:this.props.selected.length==1 &&
          !this.props.disable.edit &&
          buttonFilter('edit', this.props),
      delete:this.props.selected.length>0 &&
           !this.props.disable.delete &&
          buttonFilter('delete', this.props),
      cut:this.props.selected.length>0 &&
           !this.props.disable.cut &&
          buttonFilter('cut', this.props),
      copy:this.props.selected.length>0 &&
           !this.props.disable.copy &&
          buttonFilter('copy', this.props),
      paste:this.props.selected.length==0 &&
           !this.props.disable.paste &&
          buttonFilter('paste', this.props)
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

ChildrenToolbar.propTypes = {
  title: PropTypes.string,
  selected: PropTypes.array,
  additems: PropTypes.array,
  rightitems: PropTypes.array,
  onbutton: PropTypes.func,
  onadd: PropTypes.func,
  onrightmenu: PropTypes.func,
  disable: PropTypes.object
}

ChildrenToolbar.defaultProps = {
  selected: [],
  additems: [],
  rightitems: [],
  disable: {}
}

export default ChildrenToolbar
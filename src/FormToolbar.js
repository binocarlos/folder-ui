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
 
export default class FormToolbar extends BaseToolbar {

  render() {

    var buttonFilter = this.props.buttonFilter || function(name, props){
      return true
    }

    var displayMap = {
      title:this.props.title,
      rightmenu:this.props.rightitems.length>0 &&
          !this.props.disable.rightmenu &&
          buttonFilter('rightmenu', this.props),
      save:!this.props.disable.save &&
          buttonFilter('save', this.props),
      cancel:this.props.rightitems.length>0 &&
          !this.props.disable.rightmenu &&
          buttonFilter('rightmenu', this.props)
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
            displayMap.open ? (
              this.getButton('Save', () => {
                this.props.onbutton('save')
              })
            ) : null
          }
          {
            displayMap.edit ? (
              this.getButton('Cancel', () => {
                this.props.onbutton('cancel')
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

FormToolbar.propTypes = {
  title: PropTypes.string,
  selected: PropTypes.object,
  rightitems: PropTypes.array,
  onbutton: PropTypes.func,
  onadd: PropTypes.func,
  onrightmenu: PropTypes.func,
  disable: PropTypes.object
}

FormToolbar.defaultProps = {
  selected: {},
  rightitems: [],
  disable: {}
}
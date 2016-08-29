import React, { Component, PropTypes } from 'react'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import ButtonDropdown from 'kettle-ui/lib/ButtonDropdown'
import IconDropdown from 'kettle-ui/lib/IconDropdown'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'

const STYLES = {
  button:{  
    margin:'10px'
  },
  leftSeperator:{
    width:'25px',
    display:'inline-block'
  }
}

class FolderUIToolbar extends Component {

  getMenuItems(items, handler) {
    return (items || []).map((item,i) => {
      return (
        <MenuItem key={i} primaryText={item.title} onTouchTap={() => {
          handler(item)
        }}/>
      )
    })
  }

  getButtonDropdown(label, items, handler, extraProps = {}, i) {
    return (
      <ButtonDropdown
        key={i}
        buttonclass={RaisedButton}
        buttonprops={{
          label:label,
          style:STYLES.button,
          ...extraProps
        }}>
        <Menu>
        {this.getMenuItems(items, handler)}
        </Menu>
      </ButtonDropdown>
    )
  }

  getIconDropdown(icon, items, handler, i) {
    return (
      <IconDropdown
        key={i}
        icon={icon}
        items={items}
        onselect={handler} />
    )
  }

  getButton(label, handler, extraProps = {}, i) {
    return (
      <RaisedButton 
        key={i}
        label={label}
        style={STYLES.button} 
        onTouchTap={handler}
        {...extraProps} />
    )
  }

  getButtonFromSchema(schema, i) {
    if (schema.type=='dropdown') {
      return this.getButtonDropdown(schema.title, schema.items, item => {
        this.props.onButton(item.id, item.data, this.props.selected)
      }, schema.extraProps, i)
    }
    else if (schema.type=='button') {
      return this.getButton(schema.title, item => {
        this.props.onButton(item.id, item.data, this.props.selected)
      }, schema.extraProps, i)
    }
    else if (schema.type=='icon') {
      return this.getIconDropdown(schema.icon, schema.items, item => {
        this.props.onButton(item.id, item.data, this.props.selected)
      }, schema.extraProps, i)
    }
    else {
      return (
        <div></div>
      )
    }
  }


  render() {

    return (
      <Toolbar>
        <ToolbarGroup key={0}>
          {
            this.props.title ? (
              <ToolbarTitle text={this.props.title} />
            ) : null
          }
          {
            this.props.title ? (
              <ToolbarSeparator />
            ) : null
          }

          <div style={STYLES.leftSeperator}></div>

          {
            this.props.leftbuttons.map((leftbutton, i) => {
              return this.getButtonFromSchema(leftbutton, i)
            })
          }
          

          {this.props.children}
        
        </ToolbarGroup>

        <ToolbarGroup key={1}>
          {
            this.props.rightchildren
          }
          {
            this.props.rightbuttons.map((rightbutton, i) => {
              return this.getButtonFromSchema(rightbutton, i)
            })
          }
       
        </ToolbarGroup>
        
      </Toolbar>
    )
  }

}

FolderUIToolbar.propTypes = {
  title: PropTypes.string,
  selected: PropTypes.array,
  leftbuttons: PropTypes.array,
  rightbuttons: PropTypes.array,
  rightitems: PropTypes.array,
  onButton: PropTypes.func
}

FolderUIToolbar.defaultProps = {
  title: '',
  selected: [],
  leftbuttons: [],
  rightbuttons: [],
  rightitems: [],
  onButton: function(){}
}

export default FolderUIToolbar
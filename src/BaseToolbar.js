import React, { Component, PropTypes } from 'react'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import ButtonDropdown from 'kettle-ui/lib/ButtonDropdown'
import IconDropdown from 'kettle-ui/lib/IconDropdown'

const STYLES = {
  button:{  
    margin:'10px'
  },
  leftSeperator:{
    width:'25px',
    display:'inline-block'
  }
}

export default class BaseToolbar extends Component {

  getMenuItems(items, handler) {
    return (items || []).map((item,i) => {
      return (
        <MenuItem key={i} primaryText={item.title} onTouchTap={() => {
          handler(item)
        }}/>
      )
    })
  }

  getButtonDropdown(label, items, handler) {
    return (
      <ButtonDropdown
        buttonclass={RaisedButton}
        buttonprops={{
          label:label,
          style:STYLES.button
        }}>
        <Menu>
        {this.getMenuItems(items, handler)}
        </Menu>
      </ButtonDropdown>
    )
  }

  getIconDropdown(icon, items, handler) {
    return (
      <IconDropdown
        icon={icon}
        items={items}
        onselect={handler} />
    )
  }

  getButton(label, handler) {
    return (
      <RaisedButton 
        label={label}
        style={STYLES.button} 
        onTouchTap={handler} />
    )
  }

}
import React, { Component, PropTypes } from 'react'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import ButtonDropDown from 'kettle-ui/lib/ButtonDropDown'

const BUTTON_PROPS = {
  add:{
    label:"Add",
    style:{
      margin:'10px'
    }
  },
  edit:{
    label:"Edit",
    style:{
      margin:'10px'
    }
  },
  open:{
    label:"Open",
    style:{
      margin:'10px'
    }
  },
  delete:{
    label:"Delete",
    style:{
      margin:'10px'
    }
  }
}

export default class ItemToolbar extends Component {
  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          {
            this.props.selected.length<=0 ? (
              <ButtonDropDown
                buttonclass={RaisedButton}
                buttonprops={BUTTON_PROPS.add}>
                <Menu>
                {
                  (this.props.additems || []).map((additem,i) => {
                    return (
                      <MenuItem key={i} primaryText={additem.title} />
                    )
                  })
                }
                </Menu>
              </ButtonDropDown>
            ) : null
          }
          {
            this.props.selected.length==1 ? (
              <RaisedButton {...BUTTON_PROPS.open} />
            ) : null
          }
          {
            this.props.selected.length==1 ? (
              <RaisedButton {...BUTTON_PROPS.edit} />
            ) : null
          }
          {
            this.props.selected.length>0 ? (
              <RaisedButton {...BUTTON_PROPS.delete} />
            ) : null
          }
        </ToolbarGroup>
      </Toolbar>
    )
  }
}
import React, { Component, PropTypes } from 'react'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import ButtonDropDown from 'kettle-ui/lib/ButtonDropDown'

const BUTTON_PROPS = {
  all:{
    style:{
      margin:'10px'
    }
  },
  leftContainer:{
    marginLeft:'30px'
  },
  rightContainer:{
    marginRight:'50px'
  },
  leftSeperator:{
    width:'30px',
    display:'inline-block'
  },
  add:{
    label:"Add",
    style:{
      
    }
  },
  view:{
    label:"View",
    style:{
      
    }
  },
  edit:{
    label:"Edit",
    style:{
      
    }
  },
  open:{
    label:"Open",
    style:{
      
    }
  },
  delete:{
    label:"Delete",
    style:{
      
    }
  }
}

function getButtonProps(name){
  var buttonStyle = BUTTON_PROPS[name].style
  var allStyle = BUTTON_PROPS.all.style
  var mergedStyle = Object.assign({}, allStyle, buttonStyle)
  var buttonProps = BUTTON_PROPS[name]
  return Object.assign({}, buttonProps, {
    style:mergedStyle
  })
}

export default class ItemToolbar extends Component {
  render() {

    var displayMap = {
      title:this.props.title,
      add:this.props.selected.length<=0 &&
          this.props.additems.length>0 &&
          !this.props.disable.add,
      view:this.props.selected.length<=0 &&
          this.props.viewitems.length>0 &&
          !this.props.disable.view,
      open:this.props.selected.length==1 &&
           !this.props.disable.open,
      edit:this.props.selected.length==1 &&
           !this.props.disable.edit,
      delete:this.props.selected.length>0 &&
           !this.props.disable.delete
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

          <div style={BUTTON_PROPS.leftSeperator}></div>
          
          {
            displayMap.add ? (
              <ButtonDropDown
                buttonclass={RaisedButton}
                buttonprops={getButtonProps('add')}>
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
            displayMap.open ? (
              <RaisedButton {...getButtonProps('open')} />
            ) : null
          }
          {
            displayMap.edit ? (
              <RaisedButton {...getButtonProps('edit')} />
            ) : null
          }
          {
            displayMap.delete ? (
              <RaisedButton {...getButtonProps('delete')} />
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
        </ToolbarGroup>
        
        
        
      </Toolbar>
    )
  }
}

ItemToolbar.propTypes = {
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

ItemToolbar.defaultProps = {
  selected: [],
  additems: [],
  viewitems: [],
  disable: {}
}
import React, { Component, PropTypes } from 'react'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import ButtonDropDown from 'kettle-ui/lib/ButtonDropDown'

const STYLES = {
  button:{  
    margin:'10px'
  },
  leftSeperator:{
    width:'25px',
    display:'inline-block'
  }
}

export default class ViewToolbar extends Component {

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
      edit:!this.props.disable.edit,
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
              <ButtonDropDown
                buttonclass={RaisedButton}
                buttonprops={{
                  label:'Add',
                  style:STYLES.button
                }}>
                <Menu>
                {
                  (this.props.additems || []).map((additem,i) => {
                    return (
                      <MenuItem key={i} primaryText={additem.title} onTouchTap={() => {
                        this.props.onadd(additem)
                      }}/>
                    )
                  })
                }
                </Menu>
              </ButtonDropDown>
            ) : null
          }

          {
            displayMap.open ? (
              <RaisedButton 
                label='Open'
                style={STYLES.button} 
                onTouchTap={() => {
                  this.props.onbutton('open', this.props.selected)
                }} />
            ) : null
          }
          {
            displayMap.edit ? (
              <RaisedButton 
                label='Edit'
                style={STYLES.button} 
                onTouchTap={() => {
                  this.props.onbutton('edit', this.props.selected)
                }} />
            ) : null
          }
          {
            displayMap.delete ? (
              <RaisedButton 
                label='Delete'
                style={STYLES.button} 
                onTouchTap={() => {
                  this.props.onbutton('delete', this.props.selected)
                }} />
            ) : null
          }
          <ToolbarSeparator />
          <div style={STYLES.leftSeperator}></div>
          {
            displayMap.cut ? (
              <RaisedButton 
                label='Cut'
                style={STYLES.button} 
                onTouchTap={() => {
                  this.props.onbutton('cut', this.props.selected)
                }} />
            ) : null
          }
          {
            displayMap.copy ? (
              <RaisedButton 
                label='Copy'
                style={STYLES.button} 
                onTouchTap={() => {
                  this.props.onbutton('copy', this.props.selected)
                }} />
            ) : null
          }
          {
            displayMap.paste ? (
              <RaisedButton 
                label='Paste'
                style={STYLES.button} 
                onTouchTap={() => {
                  this.props.onbutton('paste', this.props.selected)
                }} />
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
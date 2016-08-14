import React, { Component, PropTypes } from 'react'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import { mergeStyles } from 'kettle-ui/lib/tools'

const DEFAULT_STYLES = {
  
}

function getStyles(overrides = {}){
  return mergeStyles(DEFAULT_STYLES, overrides)
}

export default class FolderToolbar extends Component {
  render() {

    var styles = getStyles(this.props.styles)

    return (
      <Toolbar>
        <ToolbarGroup>
          <ToolbarTitle text="Options" />
        </ToolbarGroup>
      </Toolbar>
    )
  }
}
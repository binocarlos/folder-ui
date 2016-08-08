import React, { PropTypes, Component } from 'react'
import update from 'react/lib/update'
import {ListItem} from 'material-ui/List'
import Folder from 'material-ui/svg-icons/file/folder'

class TreeNode extends Component {

  handleClick(e) {
    console.log(JSON.stringify(this.props, null, 4))
  }

  render() {

    var data = this.props.data || {}
    var children = data.children || []
    var name = data.name || 'no title'

    var get_icon = this.props.get_icon || function(data){
      return <Folder />
    }

    var use_icon = get_icon(data)

    return (
      <ListItem 
        primaryText={name} 
        leftIcon={use_icon} 
        onTouchTap={this.handleClick.bind(this)} />
    )
    
  }

}

export default TreeNode
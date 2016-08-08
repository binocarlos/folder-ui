import React, { PropTypes, Component } from 'react'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Folder from 'material-ui/svg-icons/file/folder'

class TreeViewer extends Component {
  
  getTreeNode(data, get_icon, i) {
    var children = data.children || []
    var name = data.name || 'no title'
    var use_icon = get_icon(data)

    var childnodes = children.map((node, i) => {
      return this.getTreeNode(node, get_icon, i)
    })

    var handleClick = () => {
      this.props.select_node(data)
    }

    return (
      <ListItem 
        key={i}
        primaryText={name} 
        primaryTogglesNestedList={true} 
        leftIcon={use_icon} 
        onNestedListToggle={handleClick} 
        nestedItems={childnodes} />
    )
  }

  render() {

    var data = this.props.data || []
    var get_icon = this.props.get_icon || function(data){
      return <Folder />
    }

    return (
      <List>
        {this.props.title ? 
          (
            <Subheader>
              {this.props.title}
            </Subheader>
          )
          : 
          null
        }
        {data.map((node, i) => {
          return this.getTreeNode(node, get_icon, i)
        })}
      </List>
    )
  }

}

export default TreeViewer
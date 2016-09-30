import React, { PropTypes, Component } from 'react'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Folder from 'material-ui/svg-icons/file/folder'
import { mergeStyles } from 'kettle-ui/lib/tools'
import { getChildren } from './tools'

const DEFAULT_STYLES = {
  selected:{
    backgroundColor:'rgb(232, 232, 232)'
  },
  header:{
    marginTop:'4px',
    marginBottom:'4px'
  }
}

function getStyles(overrides = {}){
  return mergeStyles(DEFAULT_STYLES, overrides)
}

class TreeViewer extends Component {
  
  getTreeNode(data, get_icon, styles, i, treeopen) {
    let treedata = this.props.treedata || {}
    let children = getChildren(treedata, data.id)
    let name = data.name || 'no title'
    let use_icon = get_icon(data)
    let is_node_open = treeopen[data.id] ? true : false

    let childnodes = children.map((node, i) => {
      return this.getTreeNode(node, get_icon, styles, i, treeopen)
    })

    let handleClick = () => {
      this.props.selectNode(data)
    }

    let handleToggle = () => {
      this.props.toggleNode(data)
    }

    let itemStyle = data.id==this.props.selected.id ? styles.selected : null

    return (
      <ListItem 
        key={i}
        primaryText={name} 
        primaryTogglesNestedList={false} 
        leftIcon={use_icon} 
        style={itemStyle}
        onTouchTap={handleClick}
        onNestedListToggle={handleToggle}
        open={is_node_open}
        initiallyOpen={is_node_open}
        nestedItems={childnodes} />
    )
  }

  render() {
    let treedata = this.props.treedata || {}
    let treeopen = this.props.treeopen || {}
    let get_icon = this.props.getIcon || function(data){
      return <Folder />
    }
    let styles = getStyles(this.props.styles)

    let rootnodes = (treedata.rootids || []).map(id => {
      return treedata.data[id]
    })

    return (
      <List>
        {this.props.title ? 
          (
            <Subheader style={styles.header}>
              {this.props.title}
            </Subheader>
          )
          : 
          null
        }
        {rootnodes.map((node, i) => {
          return this.getTreeNode(node, get_icon, styles, i, treeopen)
        })}
      </List>
    )    
  }

}

export default TreeViewer
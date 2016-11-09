import React, { PropTypes, Component } from 'react'
import muiThemeable from 'material-ui/styles/muiThemeable'
import {
  Table, 
  TableBody, 
  TableHeader,
  TableHeaderColumn, 
  TableRow, 
  TableRowColumn
} from 'material-ui/Table'

const getFieldTitle = (field = {}) => {
  if(field.title) return field.title
  return field.name ?
    field.name.replace(/^\w/, (s) => s.toUpperCase()) :
    ''
}

class ChildrenTable extends Component {

  // the info we pass to functions
  getContext() {
    return {
      parent:this.props.parent,
      children:this.props.data,
      getState:this.props.getState,
      dispatch:this.props.dispatch,
      actions:this.props.actions,
      theme:this.props.muiTheme,
      params:this.props.params
    }
  }

  render() {

    const fields = this.props.getFields ?
      this.props.getFields(this.getContext()) :
      []
    const data = this.props.data || []
    const selected = this.props.selected
    const renderfns = fields.map(field => {
      return field.render || function(data){
        return (
          <div>{data}</div>
        )
      }
    })

    return (
      <Table
        height={this.props.height}
        selectable={this.props.selectable}
        multiSelectable={this.props.multiSelectable}
        onRowSelection={(indexes) => {
          this.props.onRowSelection(indexes.map(index => {
            return this.props.data[index].id
          }))
        }}
      >
      {this.props.showHeader ? (
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={this.props.showCheckboxes}
          enableSelectAll={false}
        >
          <TableRow>
            {fields.map( (field, index) => {
              return (
                <TableHeaderColumn key={index} style={field.style}>
                  <div>
                    {getFieldTitle(field)}
                  </div>
                </TableHeaderColumn>
              )
            })}
          </TableRow>
        </TableHeader>
      ) : null}
        <TableBody
          displayRowCheckbox={this.props.showCheckboxes}
          deselectOnClickaway={false}
        >
          {data.map( (row, index) => (
            <TableRow key={index} selected={this.props.selected[row.id]}>
              {fields.map( (field, index) => {
                const render = renderfns[index]
                const content = render(row)

                const wrappedContent = field.preventRowSelection ?
                  (
                    <div onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}>
                      {content}
                    </div>
                  ) :
                  content

                return (
                  <TableRowColumn key={index} style={field.style}>{wrappedContent}</TableRowColumn>
                )
              })}
            </TableRow>
            ))}
        </TableBody>
      </Table>
    )
  }
}

ChildrenTable.defaultProps = {
  showCheckboxes: false,
  multiSelectable: false,
  selectable: true,
  selected:{},
  data:[],
  showHeader: true
}

export default muiThemeable()(ChildrenTable)
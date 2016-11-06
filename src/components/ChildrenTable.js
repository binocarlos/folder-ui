import React, { PropTypes, Component } from 'react'
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
    null
}

class ChildrenTable extends Component {

  render() {

    const fields = this.props.fields || []
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
            {fields.map( (field, index) => (
              <TableHeaderColumn key={index}>
                {getFieldTitle(field)}
              </TableHeaderColumn>
            ))}
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
                return (
                  <TableRowColumn key={index}>{content}</TableRowColumn>
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

export default ChildrenTable
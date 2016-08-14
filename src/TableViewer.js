import React, { PropTypes, Component } from 'react'
import {
  Table, 
  TableBody, 
  TableHeader,
  TableHeaderColumn, 
  TableRow, 
  TableRowColumn
} from 'material-ui/Table'

class TableViewer extends Component {
  render() {
    const fields = this.props.fields || []
    const data = this.props.data || []
    const renderfns = fields.map(field => {
      return field.render || function(data){
        return (
          <div></div>
        )
      }
    })

    return (
      <Table
        height={this.props.height}
        selectable={this.props.selectable}
        multiSelectable={this.props.multiSelectable}
      >
      {this.props.hideHeader ? null : (
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
          enableSelectAll={false}
        >
          <TableRow>
            {fields.map( (field, index) => (
              <TableHeaderColumn key={index}>{field.title}</TableHeaderColumn>
            ))}
          </TableRow>
        </TableHeader>
      )}
        <TableBody
          displayRowCheckbox={false}
          deselectOnClickaway={true}
        >
          {data.map( (row, index) => (
            <TableRow key={index}>
              {fields.map( (field, index) => {
                const render = renderfns[index]
                const content = render(row)
                return (
                  <TableHeaderColumn key={index}>{content}</TableHeaderColumn>
                )
              })}
            </TableRow>
            ))}
        </TableBody>
      </Table>
    )
  }
}

export default TableViewer
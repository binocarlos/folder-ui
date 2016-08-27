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

  onRowSelection(selected) {
    this.props.onRowSelection(selected.map(i => {
      return this.props.data[i]
    }))
  }

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
        onRowSelection={this.onRowSelection.bind(this)}
      >
      {this.props.showHeader ? (
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={this.props.showCheckboxes}
          enableSelectAll={false}
        >
          <TableRow>
            {fields.map( (field, index) => (
              <TableHeaderColumn key={index}>{field.title}</TableHeaderColumn>
            ))}
          </TableRow>
        </TableHeader>
      ) : null}
        <TableBody
          displayRowCheckbox={this.props.showCheckboxes}
          deselectOnClickaway={false}
        >
          {data.map( (row, index) => (
            <TableRow key={index}>
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

TableViewer.defaultProps = {
  showCheckboxes: false,
  multiSelectable: false,
  selectable: true,
  showHeader: true
}

export default TableViewer
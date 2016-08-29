import React, { PropTypes, Component } from 'react'
import {
  Table, 
  TableBody, 
  TableHeader,
  TableHeaderColumn, 
  TableRow, 
  TableRowColumn
} from 'material-ui/Table'

class ChildrenViewer extends Component {

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
        onRowSelection={this.props.onRowSelection}
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
            <TableRow key={index} selected={row._selected}>
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

ChildrenViewer.defaultProps = {
  showCheckboxes: false,
  multiSelectable: false,
  selectable: true,
  showHeader: true,
  selectedids: ''
}

export default ChildrenViewer
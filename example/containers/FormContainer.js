import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import { table_select_nodes } from '../actions'

import FormViewer from '../../src/FormViewer'
import Toolbar from '../../src/Toolbar'

export class FormContainer extends Component {

  render() {
    return (   
      <ToolbarWrapper
        offsetWidth={this.props.offsetWidth}
        toolbar={<Toolbar 
                    title="Form Toolbar"
                  />}>

        <FormViewer {...this.props} />

      </ToolbarWrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormContainer)
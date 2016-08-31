import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ToolbarWrapper from 'kettle-ui/lib/ToolbarWrapper'

import { snackbar_close } from './actions'
import ChildrenContainer from './ChildrenContainer'
import FormContainer from './FormContainer'
import Snackbar from 'material-ui/Snackbar'

const SNACKBAR_AUTOHIDE = 5000

const STYLES = {
  wrapper:{
    width:'100%',
    height:'100%'
  }
}

export class ContentContainer extends Component {

  render() {

    let ContentType = this.props.mode=='form' ? FormContainer : ChildrenContainer

    return (
      <div style={STYLES.wrapper}>
        <ContentType {...this.props} />
        <Snackbar 
          open={this.props.snackbarOpen}
          message={this.props.snackbarMessage}
          autoHideDuration={SNACKBAR_AUTOHIDE}
          onRequestClose={this.props.snackbarClose} />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {

  let reducername = ownProps.reducername || 'folderui'

  return {
    mode:state[reducername].editing ? 'form' : 'children',
    snackbarOpen:state[reducername].snackbar.open,
    snackbarMessage:state[reducername].snackbar.message
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    snackbarClose:function(){
      dispatch(snackbar_close())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContentContainer)
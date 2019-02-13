import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root')

const customStyle = {
  content: {
    top: '35%',
    left: '30%',
    right: 'auto',
    bottom: 'auto',
    width: '40%',
  },
};

export default class SubmissionModal extends React.Component {

    static propTypes = {
        msg: PropTypes.string,
        showModal : PropTypes.bool.isRequired,
        onChangeVisibility : PropTypes.func.isRequired,
    };

    constructor (props) {
        super(props);
        this.state = {
            showModal : false
        };
    }

    render() {

        const { showModal, onChangeVisibility, msg } = this.props;

        return (
            <div>
            <ReactModal
            isOpen = { showModal }
            onRequestClose={onChangeVisibility}
            style={ customStyle }
            >
            <p> { msg } </p>
            <button onClick = {onChangeVisibility} > Close </button>
            </ReactModal>
            </div>
        );
    };
}

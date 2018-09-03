import React from 'react';
import PropTypes from 'prop-types';

export default class Checkbox extends React.Component {
    static propTypes = {
        checked: PropTypes.bool,
        handleChange: PropTypes.func,
    };

    toggleValue = () => {
        const {handleChange, checked} = this.props;
        handleChange(!checked);
    };

    render() {
        const {checked} = this.props;

        return (
            <input
                type={'checkbox'}
                checked={checked}
                onChange={this.toggleValue}
            />
        )
    }
}
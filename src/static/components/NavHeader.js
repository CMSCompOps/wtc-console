import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';

import BackButton from './BackButton';


class NavHeader extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        history: PropTypes.object.isRequired,
    };

    goBack = () => {
        this.props.history.goBack();
    };

    render() {
        const {title} = this.props;

        return (
            <h1 className="text-center margin-bottom-medium">
                <BackButton onClick={this.goBack}/>
                {title}
            </h1>
        )
    }
}

export default withRouter(NavHeader);

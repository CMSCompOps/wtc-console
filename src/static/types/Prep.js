import PropTypes from 'prop-types';

export default PropTypes.shape({
    name: PropTypes.string,
    campaign: PropTypes.string,
    workflows_count: PropTypes.number,
    created: PropTypes.string,
    updated: PropTypes.string,
});
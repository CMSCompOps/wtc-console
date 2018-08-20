import PropTypes from 'prop-types';
import WorkflowSiteStatus from './WorkflowSiteStatus';

export default PropTypes.shape({
    name: PropTypes.string,
    campaign: PropTypes.string,
    created: PropTypes.string,
    updated: PropTypes.string,
});
import PropTypes from 'prop-types';
import Prep from './Prep'
import WorkflowSiteStatus from './WorkflowSiteStatus';

export default PropTypes.shape({
    name: PropTypes.string,
    prep: Prep,
    created: PropTypes.string,
    updated: PropTypes.string,
    statuses: PropTypes.arrayOf(WorkflowSiteStatus),
});
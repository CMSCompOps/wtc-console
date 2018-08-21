import PropTypes from 'prop-types';
import Prep from './Prep'
import TaskSiteStatus from './TaskSiteStatus';

export default PropTypes.shape({
    name: PropTypes.string,
    job_type: PropTypes.string,
    created: PropTypes.string,
    updated: PropTypes.string,
    statuses: PropTypes.arrayOf(TaskSiteStatus),
});
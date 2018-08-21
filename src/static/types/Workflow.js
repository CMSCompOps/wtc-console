import PropTypes from 'prop-types';
import Prep from './Prep'
import Task from './Task';

export default PropTypes.shape({
    name: PropTypes.string,
    prep: Prep,
    created: PropTypes.string,
    updated: PropTypes.string,
    tasks_count: PropTypes.number,
    tasks: PropTypes.arrayOf(Task),
});
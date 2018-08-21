import PropTypes from 'prop-types';

export default PropTypes.shape({
    id: PropTypes.number,
    site: PropTypes.string,
    dataset: PropTypes.string,
    task_workflow_name: PropTypes.string,
    success_count: PropTypes.number,
    failed_count: PropTypes.number,
});
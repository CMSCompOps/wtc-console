import PropTypes from 'prop-types';
import Prep from './Prep'

export default PropTypes.shape({
    name: PropTypes.string,
    prep: Prep,
    updated: PropTypes.string,
});
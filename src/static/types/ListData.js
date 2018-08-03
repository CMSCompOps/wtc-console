import PropTypes from 'prop-types';

export default function getListDataType(resultShape) {
    return PropTypes.shape({
        current: PropTypes.number,
        pages: PropTypes.number,
        total: PropTypes.number,
        result: PropTypes.arrayOf(resultShape),
    });
}

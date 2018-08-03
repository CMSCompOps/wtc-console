import moment from 'moment';


const TIMESTAMP_FORMAT = 'YYYY-MM-DD hh:mm:ss';

export function getReadableTimestamp(date) {
    return date
        ? moment(date).format(TIMESTAMP_FORMAT)
        : '';
}
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

// I18N
import 'dayjs/locale/ru'; // import locale
import 'dayjs/locale/en'; // import locale
import { DEFAULT_LOCALE } from '~/config/app.config';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(isoWeek);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

dayjs.locale(DEFAULT_LOCALE); // use locale

export default dayjs;

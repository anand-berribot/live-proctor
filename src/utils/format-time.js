import { format, getTime, formatDistanceToNow, parse } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fTime(date, newFormat) {
  const fm = newFormat || 'p';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  if (!date) return '';

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) return 'Invalid Date'; 

  return format(parsedDate, fm);
}

export function fDateTime1(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  if (!date) return '';

  const isCustomFormat = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(date);

  if (isCustomFormat) {
    const parsedDate = parse(date, 'dd-MM-yyyy HH:mm:ss', new Date());

    if (isNaN(parsedDate)) return 'Invalid Date'; 

    return format(parsedDate, fm);
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) return 'Invalid Date'; 

  return format(parsedDate, fm);
}

// export function fDateTime(date, newFormat) {
//   const fm = newFormat || 'dd MMM yyyy p';

//   return date ? format(new Date(date), fm) : '';
// }
// export function fDateTime1(date, newFormat) {
//   const fm = newFormat || 'dd MMM yyyy p';

//   const isCustomFormat = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/.test(date);

//   if (isCustomFormat) {
//     const parsedDate = parse(date, 'dd-MM-yyyy HH:mm:ss', new Date());
//     return format(parsedDate, fm);
//   }

//   return date ? format(new Date(date), fm) : '';
// }
export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

export function isBetween(inputDate, startDate, endDate) {
  const date = new Date(inputDate);

  const results =
    new Date(date.toDateString()) >= new Date(startDate.toDateString()) &&
    new Date(date.toDateString()) <= new Date(endDate.toDateString());

  return results;
}

export function isAfter(startDate, endDate) {
  const results =
    startDate && endDate ? new Date(startDate).getTime() > new Date(endDate).getTime() : false;

  return results;
}

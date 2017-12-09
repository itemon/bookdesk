/**
 * format date time
 */

const toDateString = (date, separator = '-') => {
  return [
    date.getFullYear(), 
    date.getMonth() + 1, 
    date.getDate()]
    .map((i) => {return i < 10 ? '0' + i : i}).join(separator);
}

const toDateRange = () => {
  const begin = new Date();
  const end = new Date(begin.getTime());
  end.setFullYear(end.getFullYear() + 1);
  return [begin, end];
}

module.exports.toDateString = toDateString;
module.exports.toDateRange = toDateRange;
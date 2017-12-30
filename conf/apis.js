
const apis = {
  booking: '/gsf/reserve/ajax-add'
}

const getUrl = (path, opts = {}) => {
  const { host = 'api.themokutanya.com.cn'} = opts;
  return `https://${host}${path}`;
}

module.exports.getUrl = getUrl;
module.exports.APIs = apis;
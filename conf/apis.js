
const apis = {
  booking: '/gsf/reserve/ajax-add',
  openid: '/gsf/reserve/ajax-openid',
  orders: '/gsf/reserve/ajax-order-list',
  order_item: '/gsf/reserve/ajax-order-detail'
}

const getUrl = (path, opts = {}) => {
  const { host = 'api.themokutanya.com.cn'} = opts;
  return `https://${host}${path}`;
}

module.exports.getUrl = getUrl;
module.exports.APIs = apis;
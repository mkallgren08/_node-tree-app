const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '711890',
  key: '680dba39aa47204dd222',
  secret: '0890ac6ad9f340727309',
  cluster: 'mt1',
  encrypted: true
});

module.exports = pusher
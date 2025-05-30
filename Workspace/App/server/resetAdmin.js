const { Keystone } = require('@keystonejs/keystone');
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');
const { Password } = require('@keystonejs/fields');
const dotenv = require('dotenv');
dotenv.config();

const keystone = new Keystone({
  name: 'ResetPassword',
  adapter: new MongooseAdapter({ mongoUri: process.env.MONGOSV }),
});

keystone.createList('User', {
  fields: {
    email: { type: require('@keystonejs/fields').Text },
    password: { type: Password },
  },
});

(async () => {
  await keystone.connect();
  const updated = await keystone.lists.User.adapter.update(
    'admin@gmail.com',
    { password: 'newpassword123' }
  );
  console.log('Password reset thành công:', updated);
  process.exit();
})();

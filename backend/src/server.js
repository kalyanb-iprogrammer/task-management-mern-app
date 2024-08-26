const process = require('process');
const { sequelize } = require('./utils/database/connection');
const app = require('./app');
const UserTask = require('./models/UserTasksModel');

// Make sure we are running node 7.6+
const [major] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}

// import environmental variables from our variables.env file
require('dotenv').config({ path: '.env' });

// Workers can share the same TCP connection
app.set('port', process.env.PORT);

// Sync database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  })

const server = app.listen(app.get('port'), () => {
  console.log(`Worker ${process.pid} started on port ${server.address().port}`);
});
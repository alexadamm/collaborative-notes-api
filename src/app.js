require('dotenv').config();

const container = require('./Infrastructures/container');
const createServer = require('./Infrastructures/http/createServer');

const port = process.env.PORT;

(async () => {
  const app = await createServer(container);

  app.listen(port, () => console.log(`server is running on port ${port}`));
})();

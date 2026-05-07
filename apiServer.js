const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/api');

const app = express();
const port = 7001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});

module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const moment = require('moment');
const schedule = require('node-schedule');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname));

//some endpoint
app.get('/tennis', (req, res) => {

})


const port = 8000;
app.listen(port, () => {
  console.log('We are live on ' + port);
});

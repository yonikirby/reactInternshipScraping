const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const serverless = require('serverless-http');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const path = require('path');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

app.use(cors())
app.use(favicon(path.join(__dirname, "favicon.ico")));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
const express = require('express');
const consign = require('consign');

const app = express();
consign()
    // .include('src/models')
    .then('lib/config.js')
    //.then('src/core')
    .then('src/controllers')
    .then('src/routes')
    .then('lib/boot.js')
    .into(app);
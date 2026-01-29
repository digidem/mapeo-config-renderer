#!/usr/bin/env node

const app = require("./api");

const [, , comapeocatFile = process.env.DEFAULT_FILE] = process.argv;
app(comapeocatFile);

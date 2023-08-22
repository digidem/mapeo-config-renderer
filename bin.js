#!/usr/bin/env node

const app = require("./api");

const [, , mapeoConfigFolder = "."] = process.argv;
app(mapeoConfigFolder);

#!/usr/bin/env node

const app = require("./api");

const [, , mapeoConfigFolder = process.env.CONFIG_FOLDER || "."] = process.argv;
app(mapeoConfigFolder);

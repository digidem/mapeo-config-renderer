#!/usr/bin/env node

const app = require("./api");

DEFAULT_CAT =
  "./node_modules/@comapeo/default-categories/dist/comapeo-default-categories.comapeocat";
const [, , comapeocatFile = DEFAULT_CAT] = process.argv;
app(comapeocatFile);

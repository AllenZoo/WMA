/* eslint-disable no-undef */
const path = require("path");
const { register } = require("@swc-node/register/register");
const {
  readDefaultTsConfig,
} = require("@swc-node/register/read-default-tsconfig");

register(readDefaultTsConfig(path.join(__dirname, "tsconfig.json")));

module.exports = require("./tailwind.config.ts").default;

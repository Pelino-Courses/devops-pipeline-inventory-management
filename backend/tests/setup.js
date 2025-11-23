const request = require("supertest");
const app = require("../src/app");

global.request = request;
global.app = app;

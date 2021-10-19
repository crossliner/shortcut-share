const fastify = require("fastify");
const app = fastify();

fastify.register(require("fastify-multipart"));
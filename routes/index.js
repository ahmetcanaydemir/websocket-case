const setupAuthRoutes = require("./auth");
const setupAppRoutes = require("./app");

function setupRoutes(app) {
  setupAuthRoutes(app);
  setupAppRoutes(app);
}

module.exports = setupRoutes;

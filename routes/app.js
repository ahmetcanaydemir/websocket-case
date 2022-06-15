const User = require("../models/User");
const { body, validationResult } = require("express-validator");

function setupAppRoutes(app) {
  app.get("/", function (req, res) {
    const user = req.session.user;
    if (!user) {
      return res.redirect("/login");
    }

    res.render("app", { user: { ...user, password: undefined } });
  });
}

module.exports = setupAppRoutes;

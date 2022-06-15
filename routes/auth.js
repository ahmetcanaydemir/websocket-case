const User = require("../models/User");
const { body, validationResult } = require("express-validator");

function setupAuthRoutes(app) {
  app.get("/register", (req, res) => {
    res.render("register", { errors: [], body: req.body });
  });

  app.post(
    "/register",
    body("firstName").notEmpty().withMessage("İsim boş olamaz"),
    body("lastName").notEmpty().withMessage("Soyisim boş olamaz"),
    body("email").isEmail().withMessage("Eposta adresi geçerli değil"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Şifre alanı en az 8 karakter içermeli")
      .isAlphanumeric()
      .withMessage("Şifre alanı boş veya geçersiz karakterler içeriyor"),
    async (req, res, next) => {
      await body("passwordConfirmation").equals(req.body.password).withMessage("Şifreler eşleşmiyor").run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render("register", { errors: errors.array(), body: req.body });
      }

      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.render("register", { errors: [{ msg: "Eposta adresi zaten kayıtlı" }], body: req.body });
      }

      user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        language: req.body.language,
        country: req.body.country,
      });
      await user.save();
      req.session.user = user;
      return res.redirect("/");
    }
  );

  app.get("/login", (req, res) => {
    res.render("login", { errors: [], body: req.body });
  });

  app.post("/login", async (req, res) => {
    try {
      const user = await User.login(req.body.email, req.body.password);
      req.session.user = user;
      return res.redirect("/");
    } catch (err) {
      return res.render("login", { errors: [{ msg: err.message }], body: req.body });
    }
  });
}

module.exports = setupAuthRoutes;

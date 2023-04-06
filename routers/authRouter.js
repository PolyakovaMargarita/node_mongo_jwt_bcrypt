const Router = require("express")
const authController = require("../controllers/authController")
const router = new Router()
const {check} = require("express-validator")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

router.post("/registration", [
    check("username", "Имя пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен быт больше 4 символов и меньше 10").isLength({min: 4, max: 10})
], authController.registration)
router.post("/login", authController.login)
router.get("/users", roleMiddleware(["ADMIN"]), authController.getUsers)

module.exports = router
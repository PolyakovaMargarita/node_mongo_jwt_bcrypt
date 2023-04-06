const User = require("../models/User")
const Role = require("../models/Role")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {validationResult} = require("express-validator")

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "24h"})
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const {username, password} = req.body
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            console.log(user)
            await user.save()
            return res.status(400).json({message: "Пользователь был успешно зарегистрирован"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Registration ERROR"})
        }
    }
    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if(!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            const validatePassword = bcrypt.compareSync(password, user.password)
            if (!validatePassword) {
                return res.status(400).json({message: "Пароль введен не верно"})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: "Login ERROR"})
        }
    }
    async getUsers(req, res) {
        try {
            //______For create roles, need once
            // const userRole = new Role()
            // const adminRole = new Role({value: "ADMIN"})
            // await userRole.save()
            // await adminRole.save()

            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new authController()
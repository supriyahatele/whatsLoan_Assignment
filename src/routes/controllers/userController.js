const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs');


const phoneRegex = /^[0]?[6789]\d{9}$/;
const nameRegex = /^[a-zA-Z]+$/
const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;

const saltRounds = 10;

const valid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value != 'string') return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const createUser = async function (req, res) {
    try {
        const body = req.body;

        if (Object.keys(body).length == 0) { return res.status(400).send({ status: false, msg: "Please enter details in the request Body " }) };

        let { firstName, lastName, email, password, phone, age } = body;

        if (!valid(firstName)) {
            return res.status(400).send({ status: false, message: "firstName is  Mandatory" });
        }
        if (!nameRegex.test(firstName)) {
            return res.status(400).send({ status: false, message: "firstName cant be number" });
        }
        if (!valid(lastName)) {
            return res.status(400).send({ status: false, message: "lastName is  Mandatory" });
        }
        if (!nameRegex.test(lastName)) {
            return res.status(400).send({ status: false, message: "lastName cant be number" });
        }
        if (!phone) {
            return res.status(400).send({ status: false, message: "phoneNumber is  Mandatory" });
        }
        if (!phoneRegex.test(phone)) {
            return res.status(400).send({ status: false, message: "phoneNumber is incorrect" });
        }
        if (!email) {
            return res.status(400).send({ status: false, message: "email is  Mandatory" });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, message: "Provide email in correct format  " });
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "password is  Mandatory" });
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send({ status: false, message: "Your password must contain atleast one number,uppercase,lowercase and special character[ @ $ ! % * ? & # ] and length should be min of 8-15 charachaters" });
        }
        if (!age) {
            return res.status(400).send({ status: false, message: "age is  Mandatory" });
        }

        const dublicateData = await userModel.findOne({ $or: [{ email: email }, { phone: phone }] });
        if (dublicateData) {
            if (dublicateData.email === email) {
                return res.status(400).send({ status: false, message: "email already exist" });
            }
            else {
                return res.status(400).send({ status: false, msg: `${phone} phone already registered ` });
            }
        }

        const encryptedPassword = await bcrypt.hash(password, saltRounds);
        const validUserData = { firstName, lastName, email, password: encryptedPassword, phone, age };
        const userdata = await userModel.create(validUserData);

        return res.status(201).send({ status: true, message: "Success", data: userdata });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const getUser = async function (req, res) {
    try {
        let userData = await userModel.find();

        if (!userData) return res.status(404).send({ status: false, message: "User data not found" });

        return res.status(200).send({ status: true, message: "User profile details", data: userData });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

const changePassword = async function (req, res) {
    try {
        const body = req.body;

        if (Object.keys(body).length == 0) { return res.status(400).send({ status: false, msg: "Please enter details in the request Body " }) };

        let { email, newPassword } = body;

        if (!email) {
            return res.status(400).send({ status: false, message: "email is  Mandatory" });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).send({ status: false, message: "Provide email in correct format  " });
        }

        if (!newPassword) {
            return res.status(400).send({ status: false, message: "password is  Mandatory" });
        }
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).send({ status: false, message: "Your password must contain atleast one number,uppercase,lowercase and special character[ @ $ ! % * ? & # ] and length should be min of 8-15 charachaters" });
        }

        const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);

        const userData = await userModel.findOneAndUpdate({ email: email }, { $set: { password: encryptedPassword } }, { new: true });
        if (!userData) return res.status(400).send({ status: false, message: "User does not exist" });

        return res.status(200).send({ status: true, message: 'Success', data: userData });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}

module.exports = { createUser, getUser, changePassword };



const jwt = require('jsonwebtoken');

const LoginSchema = require("../schemas/loginSchema");
const CreateUserSchema = require("../schemas/createUserSchema");

const User = require("../models/UserModel");

const { generatePassword, comparePassword } = require("../utils/helper");
const { successResponse } = require('../handlers/successHandler');
const { catchErrors } = require('../handlers/errorHandlers');

const EXPIRY_TIME = 8;   // 8 hours

// User Login
const Login = async (req, res) => {

    try {
        const validate = LoginSchema.validate(req.body);

        if (validate?.error) {
            catchErrors(res, 'Bad Request', validate?.error?.details[0].message)
        }

        const { email, password } = req.body;

        // Fetch user data
        const userDetails = await User.findOne({
            where: { email }
        });

        // Check user is valid or not
        if (userDetails === null) {
            catchErrors(res, 'Bad Request', "Email is not registered")
        } else {
            // compare password

            if (comparePassword(password, userDetails.password)) {

                // generate token

                const token = jwt.sign(
                    {
                        id: userDetails.id,
                        email: userDetails.email,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: EXPIRY_TIME + 'h' }
                );

                let resObj = {
                    userDetails: {
                        id: userDetails.id,
                        email: userDetails.email,
                        firstName: userDetails.first_name,
                        lastName: userDetails.last_name
                    },
                    accessToken: token
                }

                successResponse(res, 200, resObj, "Login Successfull");
            } else {
                catchErrors(res, 'Bad Request', "Password is incorrect")
            }
        }

    } catch (error) {
        catchErrors(res, null, "Something Went Wrong", error)
    }
}

// User SignUp
const SignUp = async (req, res) => {
    try {
        const validate = CreateUserSchema.validate(req.body);

        if (validate?.error) {
            catchErrors(res, 'Bad Request', validate?.error?.details[0].message)
        }

        const { email, password, firstName, lastName, } = req.body;

        const isEmailAlreadyExist = await User.findOne({ where: { email } })

        if (isEmailAlreadyExist === null) {

            // Create User
            const generatedPassword = generatePassword(password)

            let response = await User.create({
                email,
                password: generatedPassword.hash,
                first_name: firstName,
                last_name: lastName,
                salt: generatedPassword.salt
            })

            // generate token

            const token = jwt.sign(
                {
                    id: response?.dataValues?.id,
                    email,
                },
                process.env.JWT_SECRET,
                { expiresIn: EXPIRY_TIME + 'h' }
            );

            let resObj = {
                userDetails: {
                    id: response?.dataValues?.id,
                    email,
                    firstName,
                    lastName
                },
                accessToken: token
            }

            successResponse(res, 200, resObj, "Sign Up Successfull");

        } else {
            catchErrors(res, 'Bad Request', "Email already exists")
        }

    } catch (error) {
        catchErrors(res, null, "Something Went Wrong", error)
    }
}

module.exports = {
    Login,
    SignUp
}
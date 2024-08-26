const { catchErrors } = require("../handlers/errorHandlers");
const { successResponse } = require("../handlers/successHandler");
const { AVATAR_URL } = require("../utils/constants");

// Fetch User Details

const UserDetails = async (req, res) => {
    try {

        const { id, email, first_name, last_name }= req.user

        let resObj = {
            userDetails: {
                id,
                email,
                displayName: first_name + ' ' + last_name,
                photoURL: AVATAR_URL
            }
        }

        successResponse(res, 200, resObj, "User Data Fetched Successfully");

    } catch (error) {
        catchErrors(res, null, "Something Went Wrong", error)
    }
}

module.exports = {
    UserDetails
}
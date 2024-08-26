const { catchErrors } = require("../handlers/errorHandlers");
const { successResponse } = require("../handlers/successHandler");

// Fetch User Details

const UserDetails = async (req, res) => {
    try {

        const { id, email, first_name, last_name }= req.user

        let resObj = {
            userDetails: {
                id,
                email,
                displayName: first_name + ' ' + last_name,
                photoURL: "https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-25.webp"
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
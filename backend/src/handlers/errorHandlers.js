const { logger } = require("../utils/winstonHelper");

/*
  Catch Errors Handler
*/

exports.catchErrors = (res, name = 'Bad Request', message, error) => {

    if (name == 'Bad Request') {

        // Bad Request
        return res.status(400).json({
            success: false,
            result: null,
            message,
        });
    } else {

        // Server Error

        // append log in error.log file
        logger('error', 'ServerError').log({
            level: 'error',
            message: error.stack
        });

        return res.status(500).json({
            success: false,
            result: null,
            message: error?.message.includes('timed out') ? 'Server timed out, Please try again' : error.message,
        });
    }
}

/*
  Not Found Error Handler
*/
exports.notFound = (req, res, next) => {
    return res.status(404).json({
        success: false,
        message: "Api url doesn't exist ",
    });
};

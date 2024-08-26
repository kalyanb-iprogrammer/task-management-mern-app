exports.successResponse = (res, statusCode, responseObj, message) => {
    return res.status(statusCode).json({
        success: true,
        result: responseObj,
        message
    })
}
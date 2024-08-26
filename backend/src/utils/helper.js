const bcrypt = require('bcryptjs');

exports.generatePassword = (password) => {
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync(password, salt);

    return {
        salt,
        hash
    }
}

exports.comparePassword = (reqestPassword, DbPassword) => {
    return bcrypt.compareSync(reqestPassword, DbPassword)
}
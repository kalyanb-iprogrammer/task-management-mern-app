const { sequelize, DataTypes, Sequelize } = require('../utils/database/connection');

const User = sequelize.define(
    'Users', {
    id: {
        type: DataTypes.INTEGER(11),
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    }
}, {
    tableName: 'users',
    timestamps: false, // Disables automatic creation of 'createdAt' and 'updatedAt' fields
}
)

module.exports = User;
const { sequelize, DataTypes, Sequelize } = require("../utils/database/connection");

const UserTask = sequelize.define(
    'UserTasks', {
    id: {
        type: DataTypes.INTEGER(11),
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('high', 'medium', 'low'),
        defaultValue: 'medium',
    },
    status: {
        type: DataTypes.ENUM('To Do', 'In Progress', 'In Review', 'Completed'),
        defaultValue: 'To Do',
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
    is_deleted: {
        type: DataTypes.SMALLINT,
        defaultValue: 0
    }
}, {
    tableName: 'user_tasks',
    timestamps: false, // Disables automatic creation of 'createdAt' and 'updatedAt' fields
});

module.exports = UserTask;
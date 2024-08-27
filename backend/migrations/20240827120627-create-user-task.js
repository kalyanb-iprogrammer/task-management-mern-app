'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_tasks', {
      id: {
        type: Sequelize.INTEGER(11),
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    priority: {
        type: Sequelize.ENUM('high', 'medium', 'low'),
        defaultValue: 'medium',
    },
    status: {
        type: Sequelize.ENUM('To Do', 'In Progress', 'In Review', 'Completed'),
        defaultValue: 'To Do',
    },
    created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updated_at: {
        type: Sequelize.DATE,
    },
    is_deleted: {
        type: Sequelize.SMALLINT,
        defaultValue: 0
    }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_tasks');
  }
};
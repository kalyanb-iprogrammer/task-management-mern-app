'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserTask.init({
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
    sequelize,
    modelName: 'UserTask',
    tableName: 'user_tasks',
    timestamps: false,
  });
  return UserTask;
};
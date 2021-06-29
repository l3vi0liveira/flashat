const { response } = require("express");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      phone: {
        type: DataTypes.STRING,
        validate: {
          isPhone(phone) {
            if (!isNaN(phone)) {
              console.log("Valid Phone");
            } else {
              throw new Error("Invalid Phone");
            }
          },
        },
      },

      name: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      attempts: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "users",
    }
  );
  User.associate = (models) => {
    User.belongsToMany(models.Chat, {
      foreignKey: "userId",
      as: "chat",
      through: "user_chat",
    });
    User.hasMany(models.Message, {
      foreignKey: "userId",
      as: "message",
    });
    User.hasOne(models.File, {
      foreignKey: "userId",
      as: "file",
    });
    User.hasMany(models.Events, {
      foreignKey: "userId",
      as: "events",
    });
  };
  return User;
};

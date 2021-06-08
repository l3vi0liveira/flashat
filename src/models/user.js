module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "User",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        phone:DataTypes.NUMERIC,
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        email:DataTypes.STRING,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        tableName: "users",
      }
    );
    User.associate = (models) => {
      User.belongsToMany(models.Chat,{
        foreignKey: "userId",
        as:"chat",
        through:"user_chat"
      });
      User.hasMany(models.Message,{
        foreignKey:"userId",
        as:"message",
      });
    };
    return User;
  };
  
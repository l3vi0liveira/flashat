module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define(
    "Chat",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "chat",
    }
  );
  Chat.associate = (models) => {
    Chat.belongsToMany(models.User, {
      foreignKey: "chatId",
      as: "users",
      through: "user_chat",
    });
    Chat.hasMany(models.Message,{
      foreignKey:"chatId",
      as:"message",
    });
  };
  return Chat;
};

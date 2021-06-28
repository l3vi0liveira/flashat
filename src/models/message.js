module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      text: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "message",
    }
  );
  Message.associate = (models) => {
    Message.belongsTo(models.Chat, {
      foreignKey: "chatId",
      as: "chat",
    });
    Message.belongsTo(models.User, {
      foreignKey: "userId",
      as: "users",
    });
    Message.hasOne(models.File, {
      foreignKey: "messageId",
      as: "file",
    });
    Message.hasOne(models.Chat, {
      foreignKey: "lastMessageId",
      as: "lastMessage",
    });
    Message.hasOne(models.Events, {
      foreignKey: "messageId",
      as: "events",
    });
  };
  return Message;
};

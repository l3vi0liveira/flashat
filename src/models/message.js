module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          key: "id",
          model: "chat",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          key: "id",
          model: "users",
        },
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
      Message.belongsTo(models.Chat,{
          foreignKey:"chatId",
          as:"chat"
      });
      Message.belongsTo(models.User,{
          foreignKey:"userId",
          as:"users"
      });
      Message.hasOne(models.File,{
        foreignKey:"messageId",
        as:"file",
      })
  };
  return Message;
};

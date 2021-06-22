module.exports = (sequelize, DataTypes) => {
  const Events = sequelize.define(
    "Events",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      event: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "events",
    }
  );
  Events.associate = (models) => {
    Events.belongsTo(models.User, {
      foreignKey: "userId",
      as: "users",
    });
    Events.belongsTo(models.Chat, {
      foreignKey: "chatId",
      as: "chat",
    });
  };
  return Events;
};

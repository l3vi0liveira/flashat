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
    User.associate = (models) => {};
    return User;
  };
  
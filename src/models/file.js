module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define(
    "File",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      originalname: DataTypes.STRING,
      mimetype: DataTypes.STRING,
      filename: DataTypes.STRING,
      size: DataTypes.NUMERIC,
      url: {
        type: DataTypes.VIRTUAL,
        get() {
          return "http://localhost:3312/files/" + this.getDataValue("filename");
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "file",
    }
  );
  File.associate = (models) => {
      File.belongsTo(models.Message,{
          foreignKey:"messageId",
          as:"file",
      });
      File.belongsTo(models.User,{
        foreignKey:"userId",
        as:"avatar",
    });
   };
  return File;
};

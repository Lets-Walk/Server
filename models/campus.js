module.exports = (sequelize, DataTypes) => {
  const Campus = sequelize.define(
    'Campus',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domain: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      wincount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      losecount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      score: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: false, freezeTableName: true },
  )
  Campus.associate = (models) => {
    Campus.hasMany(models.User, { foreignKey: 'campusId' })
  }
  return Campus
}

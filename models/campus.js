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
    { timestamps: true },
  )
  Campus.associate = (models) => {
    Campus.hasOne(models.User)
  }
  return Campus
}

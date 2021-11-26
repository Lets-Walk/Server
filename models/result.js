module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define(
    'Result',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      startTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      winCampus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      campus1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      campus2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      participants: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false, freezeTableName: true },
  )
  Result.associate = (models) => {
    Result.belongsToMany(models.User, { through: 'Result-Users' })
  }
  return Result
}

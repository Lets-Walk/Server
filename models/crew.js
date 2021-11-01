module.exports = (sequelize, DataTypes) => {
  const Crew = sequelize.define(
    'Crew',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      headcount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    { timestamps: true },
  )
  Crew.associate = (models) => {
    Crew.belongsToMany(models.User, { through: 'Crew-Users' })
  }
  return Crew
}

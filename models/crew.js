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
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    { timestamps: true },
  )
  Crew.associate = (models) => {
    Crew.hasOne(models.Inventory, { foreignKey: 'crewId' })
    Crew.belongsToMany(models.User, { through: 'Crew-Users' })
  }
  return Crew
}

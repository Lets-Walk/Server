module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define(
    'Inventory',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
    },
    { freezeTableName: true, timestamps: false },
  )
  Inventory.associate = (models) => {
    Inventory.belongsTo(models.Crew, { foreignKey: 'crewId' })
    Inventory.hasMany(models.Item, { foreignKey: 'inventoryId' })
  }
  return Inventory
}

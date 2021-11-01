module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    'Item',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    { timestamps: false },
  )
  Item.associate = (models) => {
    Item.belongsTo(models.Inventory, {
      foreignKey: 'inventoryId',
      onDelete: 'CASCADE',
    })
    Item.belongsTo(models.User, {
      foreignKey: 'userId',
    })
  }
  return Item
}

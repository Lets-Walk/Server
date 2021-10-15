module.exports = (sequelize, DataTypes) => {
  const Walk = sequelize.define(
    'Walk',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      stepcount: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      contribution: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      wmcount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    { freezeTableName: true, timestamps: false },
  )
  Walk.associate = (models) => {
    Walk.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' })
  }
  return Walk
}

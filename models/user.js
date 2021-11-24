module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(2),
        allowNull: true,
      },
      profilemessage: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
      },
      profileUrl: {
        type: DataTypes.STRING,
        defaultValue: 'default.png',
      },
    },
    { timestamps: true },
  )
  User.associate = (models) => {
    User.belongsTo(models.Campus, { foreignKey: 'campusId' })
    User.hasOne(models.Walk, { foreignKey: 'userId', onDelete: 'CASCADE' })
    User.hasMany(models.Item, { foreignKey: 'userId' })
    User.belongsToMany(models.Crew, { through: 'Crew-Users' })
  }
  return User
}

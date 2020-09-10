export default (sequelize, DataTypes) => {
  return sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      profileImage: {
        type: DataTypes.STRING,
      }
    }
  )
}

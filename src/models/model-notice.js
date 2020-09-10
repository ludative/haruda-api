export default (sequelize, DataTypes) => {
  return sequelize.define(
    'Notice',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }
  )
}

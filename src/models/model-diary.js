export default (sequelize, DataTypes) => {
  return sequelize.define(
    'Diary',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      desc: {
        type: DataTypes.STRING,
        allowNull: false
      },
      diaryId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      diaryPw: {
        type: DataTypes.STRING,
        allowNull: false
      },
      mainImage: {
        type: DataTypes.STRING,
      }
    }
  )
}

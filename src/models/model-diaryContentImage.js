export default (sequelize, DataTypes) => {
  return sequelize.define(
    'DiaryContentImage',
    {
      imageUrl: {
        type: DataTypes.STRING,
        comment: '다이어리 컨텐츠 이미지'
      }
    }
  )
}

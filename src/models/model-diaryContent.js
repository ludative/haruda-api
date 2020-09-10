export default (sequelize, DataTypes) => {
  return sequelize.define(
    'DiaryContent',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '다이어리 컨텐츠 제목'
      },
      weather: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '날씨'
      },
      feeling: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '기분',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '내용'
      },
      createdDate: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '다이어리 추가 날짜'
      }
    }
  )
}

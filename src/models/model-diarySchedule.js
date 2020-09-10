export default (sequelize, DataTypes) => {
  return sequelize.define(
    'DiarySchedule',
    {
      title: {
        type: DataTypes.STRING,
        comment: '일정 제목'
      },
      date: {
        type: DataTypes.STRING,
        comment: '날짜'
      }
    }
  )
}

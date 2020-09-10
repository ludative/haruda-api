export default (sequelize, DataTypes) => {
  return sequelize.define(
    'DiaryTodoList',
    {
      title: {
        type: DataTypes.STRING,
        comment: '투두리스트 제목'
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: '완료 여부'
      }
    }
  )
}

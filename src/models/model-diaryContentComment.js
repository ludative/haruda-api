export default (sequelize, DataTypes) => {
  return sequelize.define(
    'DiaryContentComment',
    {
      comment: {
        type: DataTypes.TEXT,
        comment: '댓글'
      }
    }
  )
}

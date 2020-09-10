export default (sequelize, DataTypes) => {
  return sequelize.define(
    'Qna',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '질문 제목'
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: '질문 내용'
      },
      answer: {
        type: DataTypes.TEXT,
        comment: '답변',
      }
    }
  )
}

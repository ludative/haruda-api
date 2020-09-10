export default length => {
  let text = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < (length || 16); i++) {
    text += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return text
}

module.exports = function() {
  process.on('uncaughtException', (ex) => {
    console.log(ex)
    process.exit(1)
  })
  process.on('unhandledRejection', (ex) => {
    throw ex
  })
}
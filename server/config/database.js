/**
 * Configuration for database connection.
 * Formatted in relation to mongoose.connect() params in order to make importing easy
 */
module.exports = {
  uri:'mongodb://127.0.0.1:27017',
  options:{
    dbName:'test'
  }
}
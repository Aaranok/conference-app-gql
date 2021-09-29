const { getUserDataLoaders } = require('../features/user/dataLoaders')
const { getConferenceLoaders } = require('../features/conference/dataLoader')
const { getDictionaryLoaders } = require('../features/dictionary/dataLoaders')

module.exports = dbInstance => ({
  ...getUserDataLoaders(dbInstance),
  ...getConferenceLoaders(dbInstance),
  ...getDictionaryLoaders(dbInstance)
})

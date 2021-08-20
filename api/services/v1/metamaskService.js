const metamaskModel = require('../../models/metamaskModel');
const logger = require('../../middleware/logger');

module.exports = {
  addMetamaskEntry: async (fields) => {
    logger.info('Inside Store Encrypted Wallet Service');
    try {
      const newEntry = await metamaskModel.create(fields);
      return newEntry;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },
};

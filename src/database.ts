const { Model } = require('objection');
const Knex = require('knex');
const config = require('../knexfile');
import utils from './Utilities/utils'

const init = () => {
    // Initialize knex.
    const knex = Knex(config[utils.getEnvironment()]);

    // Give the knex object to objection.
    Model.knex(knex);
}

export default {
    init
}

const logic = require('./rules/logic')
const matching = require('./rules/matching')
const compile = require('./compile')

module.exports = Object.assign({ compile }, logic, matching)

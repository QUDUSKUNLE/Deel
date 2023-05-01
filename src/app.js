const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const { getProfile, validateAmount, validateAmountDeposit } = require('./middleware/getProfile')

const ContractorClientControllers = require('./controllers/contractor')
const JobControllers = require('./controllers/jobs')

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);


/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile , ContractorClientControllers.GetAContract)

/**
 * With either query params ?ClientId={ClientId} or ?ContractorId={ContractorId}
 * @returns contract of a contractor or a client
 */
app.get('/contracts', ContractorClientControllers.GetAContractorOrClientContracts);

/**
 * With either query params ?ClientId={ClientId} or ?ContractorId={ContractorId}
 * @returns unpaid jobs for for both contractor or a client
 */
app.get('/jobs/unpaid', JobControllers.unPaidJobs);

/**
 * With request body { ClientId: 2, Amount: 145 }
 * @returns unpaid jobs for for both contractor or a client
 */
app.post('/jobs/:job_id/pay', validateAmount, JobControllers.payForJob);

/**
 * With request body { amountDeposit: 145 }
 * @returns unpaid jobs for for both contractor or a client
 */
app.post('/balances/deposit/:userId', validateAmountDeposit, JobControllers.depositMoney);

module.exports = app;

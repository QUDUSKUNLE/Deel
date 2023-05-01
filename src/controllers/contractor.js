const express = require('express');
const { Op } = require("sequelize");

const app = express();

class ContractorClientControllers {

  static async GetAContract(req, res) {
    const { Contract } = req.app.get('models')
    const { id } = req.params
    const contract = await Contract.findOne({ where: { id } })
    if(!contract) return res.status(404).end()
    res.json(contract)
  }

  static async GetAContractorOrClientContracts(req, res) {
    const { Contract } = req.app.get('models')
    const { ContractorId, ClientId } = req.query
    if (ContractorId) {
      const contract = await Contract.findAll({ where: {
        ContractorId: int(ContractorId),
        status: { [Op.or]: ['new', 'in_progress'] }
      }})
      return res.status(200).json(contract)
    }
    if (ClientId) {
      const contract = await Contract.findAll({ where: {
        ClientId,
        status: { [Op.or]: ['new', 'in_progress'] }
      }})
      return res.json(contract)
    }
    if (!ContractorId || !ClientId) return res.status(400).json({
      message: 'Either Contractor or Client Id is required.'
    })
  }
}

module.exports = ContractorClientControllers;

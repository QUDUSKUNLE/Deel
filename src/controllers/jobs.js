const express = require('express');
const { Op } = require("sequelize");

const app = express();

class JobControllers {

  static async unPaidJobs(req, res) {
    try {
      const { Contract, Job } = req.app.get('models')
      const { ContractorId, ClientId } = req.query
      if (ContractorId) {
        const job = await Job.findAll({
          include: {
            model: Contract,
            where: {
              ContractorId: {
                [Op.eq]: ContractorId,
              },
              status: { [Op.or]: ['new', 'in_progress' ] }
            },
            required: true
          },
          where: { paid: { [Op.is]: null } } })
        if(!job) return res.status(400).json({ message: 'Job not yet paid.' })
        return res.json(job)
      }
      if (ClientId) {
        const job = await Job.findAll({
          include: {
            model: Contract,
            where: {
              ClientId: {
                [Op.eq]: ClientId
              },
              status: { [Op.or]: ['new', 'in_progress' ] }
            },
            required: true
          },
          where: { paid: { [Op.is]: null } } })
        if(!job) return res.status(400).json({ message: 'Job not yet paid.' })
        return res.json(job)
      }
      if (!ContractorId || !ClientId) return res.status(400).json({
        message: 'Either Contractor or Client Id is required.'
      })
    } catch (error) {
      throw error
    }
  }

  static async payForJob(req, res) {
    try {
      const { Contract, Job, Profile } = req.app.get('models')
      const { job_id } = req.params
      const { ClientId, Amount } = req.body
      const job = await Job.findOne({
        include: {
            model: Contract,
            where: {
                ClientId,
            },
            status: { [Op.or]: ['new', 'in_progress' ] },
            nested: true,
        }
    });
    const [contractor, client] = [job.Contract.ContractorId, job.Contract.ClientId]
    await Promise.all([
      Profile.increment({ balance: Amount }, { where: { id: contractor } }),
      Profile.increment({ balance: -Amount }, { where: { id: client } }),
    ])
    return res.status(200).json({ message: 'Job paid' })
    } catch (error) {
      throw error;
    }
  }

  static async depositMoney(req, res) {
    try {
      const { userId } = req.params
      const { amountDeposit } = req.body; 
      const { Profile } = req.app.get('models')
      await Profile.increment({ balance: amountDeposit}, { where: { id: userId } });

      return res.status(200).json({ message: 'Money deposited successfully' })

    } catch (error) {
      throw error;
    }
  }
}

module.exports = JobControllers;

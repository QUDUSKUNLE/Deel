const getProfile = async (req, res, next) => {
    const { Profile } = req.app.get('models')
    const { id } = req.params
    const profile = await Profile.findOne({ where: { id: req.get('profile_id') || id }})
    if(!profile) return res.status(401).end()
    req.profile = profile
    next()
}

const validateAmount = async (req, res, next) => {
    const { Profile } = req.app.get('models')
    const { Amount, ClientId } = req.body
    if (!Amount) {
        return res.status(400).json({ message: 'Amount to be paid is required.' })
    }
    if (!ClientId) {
        return res.status(400).json({ message: 'ClientId is required.' })
    }
    const id = ClientId
    const profile = await Profile.findOne({ where: { id: req.get('profile_id') || id }});
    if (profile && profile.balance < Amount) return res.status(400).json({ message: 'Can`t perform this operation, insufficient funds.' })
    req.profile = profile
    next()
}

const validateAmountDeposit = async (req, res, next) => {
    const { userId } = req.params
    const { AmountDeposit } = req.body;
    if (!userId || !amountDeposit) {
        return res.status(400).json({ message: 'userId is required or amountDeposit' })
    }
    const { Contract, Job } = req.app.get('models')
    const totalPrice = await Job.sum('price', {
    include: {
        model: Contract,
        where: {
        ClientId: {
            [Op.eq]: userId
        },
        status: { [Op.or]: ['new', 'in_progress' ] }
        },
        required: true
    },
    where: { paid: { [Op.is]: null } }
    })
    if (amountDeposit > 0.25 * totalPrice) return res.status(400).json({
        message: 'Sorry!, you can`t deposit more than 25% of total amount into your account.'
    })
    req.profile = profile
    next()
}

module.exports = { getProfile, validateAmount, validateAmountDeposit }

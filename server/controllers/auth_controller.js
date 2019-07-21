const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const {email, password, first_name, last_name} = req.body
        const result = await db.auth.check_email({email})
        if (result[0]) {
            res.status(401).send('Email already in use')
        } else {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
            const user = await db.auth.register_user({email, password: hash, first_name, last_name})
            req.session.user = {
                id: user[0].id,
                email: user[0].email,
                first_name: user[0].first_name,
                last_name: user[0].last_name
            }
            res.status(201).send(req.session.user)
        }
    },
    login: async (req, res) => {
        const db = req.app.get('db')
        const {email, password} = req.body
        const result = await db.auth.check_email({email})
        if (!result[0]) return res.status(404).send('User not found')
        if (!bcrypt.compareSync(password, result[0].password)) return res.status(401).send('Email or password incorrect')
        req.session.user = {
            id: result[0].id,
            email: result[0].email,
            first_name: result[0].first_name,
            last_name: result[0].last_name
        }
        res.status(200).send(req.session.user)
    }
}
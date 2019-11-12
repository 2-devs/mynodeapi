const UserModel = require('../../models/User')

let req = {}
let res = {}

class User {    
    constructor (_req, _res) {
        req = _req
        res = _res
        this.fieldsNotCreated = ['_id', '__v', 'createdAt', 'updatedAt', 'loggedAt', 'passwordResetToken', 'passwordResetExpires', 'status', 'activationCode']
        this.fieldsNotUpdated = ['_id', '__v', 'email', 'createdAt', 'updatedAt', 'loggedAt', 'passwordResetToken', 'passwordResetExpires', 'activationCode']
    }

    async getUser () {
        try {
            let { _id } = req.user
            let data = await UserModel.findOne({ _id })
            if (!data)
                return res.error('User not found')
            if (!data.status)
                return res.error('User account is not active')
            return res.success(data)
        } catch (err) {
            console.log(err)
            return res.error(err)
        }
    }
    
    async updateUser () {
        try {
            if (!Object.keys(req.body).length)
                return res.error(`No data received`)
            
            let { _id } = req.user
            let user = await UserModel.findOne({ _id })
            if (!user)
                return res.error(`User not found`)
            if (!user.status)
                return res.error('User account is not active')
            Object.keys(req.body).map(k => this.fieldsNotUpdated.indexOf(k) < 0 ? user[k] = req.body[k] : null)
            await user.save()
            
            return res.success({ message: `User data updated successfully` })
        } catch (err) {
            console.log(err)
            return res.error(err)
        }
    }
    
    async deleteUser () {
        try {
            let { _id } = req.user
            let user = await UserModel.findOne({ _id })
            if (!user)
                return res.error(`User not found`)
            if (!user.status)
                return res.error('User account is not active')
            await user.remove()
            
            return res.success({ message: `User account has been deleted successfully` })
        } catch (err) {
            console.log(err)
            return res.error(err)
        }
    }
}

module.exports = User

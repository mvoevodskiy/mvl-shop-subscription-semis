const { MVLoaderBase } = require('mvloader')

class Subscription extends MVLoaderBase {
  constructor (App, ...config) {
    const localDefaults = {}
    super(localDefaults, ...config)
    this.App = App
  }

  async init () {
    return super.init()
  }

  async initFinish () {
    super.initFinish()
    this.DB = this.App.DB
  }

  // async activeSubscriptions (users, raw = false) {
  //   const subscriptions = {}
  //   const where = {
  //     start: {
  //       [this.DB.S.Op.lte]: this.DB.S.fn('now')
  //     },
  //     delayUntil: {
  //       [this.DB.S.Op.lte]: this.DB.S.fn('now')
  //     },
  //     until: {
  //       [this.DB.S.Op.gte]: this.DB.S.fn('now')
  //     }
  //   }
  //   users = this.MT.makeArray(users)
  //   for (let user of users) {
  //     if (Number.isInteger(user)) {
  //       user = await this.DB.models.mvlUser.findByPk(user)
  //       if (!this.MT.empty(user)) {
  //         subscriptions[user.id] = await user.getActiveSubscriptions({ raw })
  //       }
  //     }
  //   }
  // }
}

module.exports = Subscription

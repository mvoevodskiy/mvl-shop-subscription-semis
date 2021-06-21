const { MVLoaderBase } = require('mvloader')
const { DateTime } = require('luxon')
const mt = require('mvtools')

class mvlShopSubscriptionEndingController extends MVLoaderBase {
  constructor (App, ...config) {
    const localDefaults = {
      notify: {
        before: { days: -1 },
        moment: { minutes: 3 },
        after: { days: 1 }
      },
      expire: {
        delete: { minutes: 1 }
      }
    }
    super(localDefaults, ...config)
    this.App = App
    this.caption = this.constructor.name
    // console.log('ENDING. ', this.constructor.name)
  }

  async init () {
    return super.init()
  }

  async initFinish () {
    super.initFinish()
    this.DB = this.App.DB
  }

  async check (method, periods) {
    for (const key in periods) {
      if (Object.prototype.hasOwnProperty.call(periods, key)) {
        const period = periods[key]
        if (mt.empty(period)) continue
        let start = DateTime.local()
        let end = DateTime.local()
        let startPlus = {}
        let endPlus = {}
        if ('start' in period) {
          startPlus = period.start
          endPlus = period.end
        } else {
          startPlus = period
          endPlus = period
        }
        if (!('seconds' in startPlus) && !('second' in startPlus) && !('minutes' in startPlus) && !('minute' in startPlus)) {
          start = DateTime.fromFormat('00:00:00', 'HH:mm:ss')
          end = DateTime.fromFormat('23:59:59', 'HH:mm:ss')
        }
        start = start.plus(startPlus)
        end = end.plus(endPlus)
        const subscriptions = await this.App.DB.models.mvlShopSubscription.scope('payedFuture').findAll({
          where: {
            until: {
              [this.App.DB.S.Op.between]: [start.toJSDate(), end.toJSDate()]
            }
          }
          // logging: console.log
        })
        // console.log('ENDING CONTROLLER. CHECK.', method.name, key, 'SUBSCRIPTIONS COUNT', subscriptions.length, 'START PLUS', startPlus, 'END PLUS', endPlus)
        for (const subscription of subscriptions) setImmediate(method, subscription, period)
      }
    }
  }

  async notify (periods) {
    // console.log('ENDING CONTROLLER. NOTIFY. PERIODS', periods)
    return this.check(this.notifyUser, periods || this.config.notify)
  }

  async expire (periods) {
    // console.log('ENDING CONTROLLER. EXPIRE. PERIODS', periods)
    return this.check(this.expireUser, periods || this.config.expire)
  }

  async notifyUser (subscription, period) {
    // console.log('ENDING CONTROLLER. NOTIFY USER. SUB ID', subscription.id)
    return true
  }

  async expireUser (subscription, period) {
    // console.log('ENDING CONTROLLER. EXPIRE USER. SUB ID', subscription.id)
    return true
  }
}

module.exports = mvlShopSubscriptionEndingController

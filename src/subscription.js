const { MVLoaderBase } = require('mvloader')

class mvlShopSubscription extends MVLoaderBase {
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
  }
}

mvlShopSubscription.exportConfig = {
  ext: {
    classes: {
      semis: {},
      controllers: {
        mvlShopSubscription: require('./controllers/subscriptioncontroller'),
        mvlShopSubscriptionOverride: require('./controllers/overridecontroller')
      },
      handlers: {}
    },
    configs: {
      controllers: {
        mvlShopOrder: {
          middlewares: [
            ['submit', 'mvlShopSubscriptionController.submitOrder']
            // require('./controllers/subscriptioncontroller')
          ]
        },
        mvlShopOrderStatus: {
          middlewares: [
            ['change', 'mvlShopSubscriptionController.changeStatus']
            // require('./controllers/subscriptioncontroller')
          ]
        }
      },
      handlers: {
        DBHandler: {
          sequelize: {},
          models: {
            mvlShopSubscription: require('./models/subscription')
          }
        }
      },
      semis: {}
    }
  },
  db: {}
}

module.exports = { mvlShopSubscription }

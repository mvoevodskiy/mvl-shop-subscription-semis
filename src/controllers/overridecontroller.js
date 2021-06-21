const { MVLoaderBase } = require('mvloader')

class OverrideController extends MVLoaderBase {
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
    const models = this.App.DB.models
    models.mvlUser.hasMany(models.mvlShopSubscription, {
      as: 'Subscriptions',
      foreignKey: 'UserId'
    })
    models.mvlUser.hasMany(models.mvlShopSubscription, {
      as: 'ActiveSubscriptions',
      foreignKey: 'UserId',
      scope: 'active'
    })
    // models.mvlShopProduct.hasMany(models.mvlShopSubscriptionProduct, {
    //   as: 'SubscriptionProducts',
    //   foreignKey: 'ProductId'
    // })
    models.mvlShopOrder.hasMany(models.mvlShopSubscription, {
      as: 'Subscriptions',
      foreignKey: 'OrderId'
    })
    models.mvlShopOrderProduct.hasMany(models.mvlShopSubscription, {
      as: 'Subscriptions',
      foreignKey: 'OrderProductId'
    })
  }
}

module.exports = OverrideController

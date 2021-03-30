const { MVLoaderBase } = require('mvloader')

class mvlShopSubscriptionController extends MVLoaderBase {
  constructor (App, ...config) {
    const localDefaults = {
      statuses: {
        new: ['new'],
        paid: ['paid'],
        done: ['done'],
        cancelled: ['cancelled']
      }
    }
    super(localDefaults, ...config)
    this.App = App
    this.caption = this.constructor.name

    this.submitOrder = (orderController) => (next) => async (cartOrCustomerId, customerId, orderData = undefined) => {
      const cart = await this.App.ext.controllers.mvlShopCart.get(cartOrCustomerId)
      const productIds = []
      for (const key in cart.goods) {
        if (Object.prototype.hasOwnProperty.call(cart.goods, key)) {
          productIds.push(cart.goods[key].productId)
        }
      }
      const onceUsed = await this.App.DB.models.mvlShopSubscription.scope('onetime').count({
        where: {
          UserId: cart.CustomerId,
          ProductId: productIds
        }
      })
      const subscriptionProducts = await this.App.DB.models.mvlShopSubscription.count({ where: { ProductId: productIds } })
      if (!subscriptionProducts || (subscriptionProducts && onceUsed === 0)) return next(cartOrCustomerId, customerId, orderData)
      else return this.failure('Can\'t create order. One-time subscription was used')
    }

    this.changeStatus = (statusController) => (next) => async ({ order, status }) => {
      order = await this.App.ext.controllers.mvlShopOrder.get(order)
      const res = await next({ order, status })
      status = await order.getStatus()
      if (this.config.statuses.paid.indexOf(status.key) !== -1) {
        await this.paidOrder(order)
      }
      return res
    }

    this.paidOrder = async (order) => {
      const goods = await order.getGoods()
      for (const good of goods) {
        const product = await good.getProduct()
        if (product) {
          const sProducts = await product.getSubscriptionProducts()
          for (const sProduct of sProducts) {
            const curSubscription = await this.App.DB.models.mvlShopSubscription.scope(['active']).findOne({
              where: {
                UserId: order.CustomerId
              },
              order: [['until', 'DESC']],
              logging: console.log
            })
            console.log(sProduct.get())
            let start = new Date()
            let until = new Date()
            if (curSubscription !== null) {
              start = new Date(curSubscription.get('until'))
              until = new Date(curSubscription.get('until'))
            }
            until.setSeconds(until.getSeconds() + sProduct.duration)
            await this.App.DB.models.mvlShopSubscription.create({
              start: start.toISOString(),
              until: until.toISOString(),
              name: sProduct.name,
              UserId: order.CustomerId,
              SubscriptionProductId: sProduct.id,
              OrderId: order.id,
              OrderProductId: good.id,
              ProductId: product.id
            })
          }
        }
      }
    }

    this.isActive = async ({ subscriptionIds, userIds, productIds }) => {
      const where = {}
      if (subscriptionIds) where.SubscriptionProductId = subscriptionIds
      if (userIds) where.UserId = userIds
      if (productIds) where.ProductId = productIds
      const count = await this.App.DB.models.mvlShopSubscription.scope('active').count({ where, logging: console.log })
      console.log(count, count > 0)
      return count > 0
    }
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

module.exports = mvlShopSubscriptionController

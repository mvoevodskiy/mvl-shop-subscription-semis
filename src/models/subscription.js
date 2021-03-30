module.exports = (Sequelize) => {
  return [
    {
      name: Sequelize.STRING,
      start: Sequelize.DATE,
      until: Sequelize.DATE,
      delayUntil: Sequelize.DATE,
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    },
    // Model options
    {
      scopes: {
        active: {
          where: {
            active: true,
            start: {
              [Sequelize.Op.lte]: Sequelize.fn('now')
            },
            delayUntil: {
              [Sequelize.Op.or]: [
                null,
                { [Sequelize.Op.lte]: Sequelize.fn('now') }
              ]
            },
            until: {
              [Sequelize.Op.gt]: Sequelize.fn('now')
            }
          }
        },
        payedFuture: {
          where: {
            active: true,
            until: {
              [Sequelize.Op.gt]: Sequelize.fn('now')
            }
          }
        },
        onetime: {
          include: [
            {
              model: 'mvlShopSubscriptionProduct',
              as: 'SubscriptionProduct',
              where: {
                onetime: true
              }
            }
          ]
        },
        desc: {
          order: [['until', 'DESC']]
        }
      }
    },
    // Model associations
    {
      belongsTo: [
        {
          model: 'mvlShopProduct',
          as: 'Product'
        },
        {
          model: 'mvlShopOrder',
          as: 'Order'
        },
        {
          model: 'mvlShopOrderProduct',
          as: 'OrderProduct'
        },
        {
          model: 'mvlUser',
          as: 'User'
        },
        {
          model: 'mvlShopSubscriptionProduct',
          as: 'SubscriptionProduct'
        }
      ]
    }
  ]
}

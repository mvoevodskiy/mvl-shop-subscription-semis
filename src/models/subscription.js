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
          attributes: ['id', 'name', 'start', 'delayUntil', 'active', 'ProductId', 'ProductModId', 'OrderId', 'OrderProductId', [Sequelize.fn('MAX', Sequelize.col('until')), 'until']],
          where: {
            active: true,
            until: {
              [Sequelize.Op.gt]: Sequelize.fn('now')
            }
          },
          group: ['UserId', 'ProductId'],
          // having: Sequelize.fn('MAX', Sequelize.col('until'))
        },
        desc: {
          order: [['until', 'DESC']]
        }
      },
      indexes: [
        {
          fields: ['until']
        }
      ]
    },
    // Model associations
    {
      belongsTo: [
        {
          model: 'mvlShopProduct',
          as: 'Product'
        },
        {
          model: 'mvlShopProductMod',
          as: 'ProductMod'
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
        }
      ]
    }
  ]
}

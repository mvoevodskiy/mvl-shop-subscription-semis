module.exports = (Sequelize) => {
  return [
    {
      name: Sequelize.STRING,
      duration: Sequelize.INTEGER,
      onetime: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      extended: {
        type: Sequelize.TEXT,
        defaultValue: '{}',
        allowNull: false,
        get () {
          try {
            return JSON.parse(this.getDataValue('extended'))
          } catch (e) {
            console.error('GETTER OF extended FIELD OF MODEL mvlShopSubscriptionProduct. RETURN EMPTY OBJECT. ERROR', e)
            return {}
          }
        },
        set (val) {
          try {
            val = typeof val === 'string' ? val : JSON.stringify(val)
          } catch (e) {
            console.error('SETTER OF extended FIELD OF MODEL mvlShopSubscriptionProduct. SETTING EMPTY OBJECT. ERROR', e)
            return '{}'
          }
          this.setDataValue('extended', val)
        }
      }
    },
    // Model options
    {
      scopes: {}
    },
    // Model associations
    {
      belongsTo: [
        {
          model: 'mvlShopProduct',
          as: 'Product'
        }
      ],
      hasMany: [
        {
          model: 'mvlShopSubscription',
          as: 'Subscriptions',
          foreignKey: 'SubscriptionProductId'
        }
      ]
    }
  ]
}

module.exports = (Sequelize) => {
  const jsonField = function (field) {
    return {
      type: Sequelize.TEXT,
      defaultValue: '{}',
      allowNull: false,
      get () {
        try {
          return JSON.parse(this.getDataValue(field))
        } catch (e) {
          console.error('GETTER OF ' + field + ' FIELD OF MODEL mvlShopSubscriptionProduct. RETURN EMPTY OBJECT. ERROR', e)
          return {}
        }
      },
      set (val) {
        try {
          val = typeof val === 'string' ? val : JSON.stringify(val)
        } catch (e) {
          console.error('SETTER OF ' + field + ' FIELD OF MODEL mvlShopSubscriptionProduct. SETTING EMPTY OBJECT. ERROR', e)
          return '{}'
        }
        this.setDataValue(field, val)
      }
    }
  }

  return [
    {
      name: Sequelize.STRING,
      duration: jsonField('duration'),
      onetime: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      extended: jsonField('extended')
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

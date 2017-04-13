module.exports = function(sequelize, DataTypes) {
  return sequelize.define('code', {
      code_grp_id   : { type : DataTypes.STRING(20), primaryKey: true }
    , code_name     : { type : DataTypes.STRING(50), primaryKey: true }
    , code_value    : { type : DataTypes.STRING(100) }
    , code_seq      : { type : DataTypes.INTEGER(2)}
  }, {
	  timestamps: false,
	  tableName: 'code'
  });
};
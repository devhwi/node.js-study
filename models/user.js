/*
| module.exports = function(sequelize, DataTypes) {
|   var _yourTableName = sequelize.define('모델명', { 특성 }, { 옵션 });
|   return _yourTableName;
| };
*/
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
      user_id       : { type : DataTypes.STRING(20), primaryKey: true }
    , user_password : { type : DataTypes.STRING(128) }
    , user_name     : { type : DataTypes.STRING(30) }
    , user_phone    : { type : DataTypes.STRING(13), allowNull: true }
    , user_email    : { type : DataTypes.STRING(100), allowNull: true }
    , user_birth    : { type : DataTypes.DATE, allowNull: true }
    , user_reg_date : { type : DataTypes.DATE }
  }, {
	  timestamps: false,
	  tableName: 'user'
  });
};
/*
| module.exports = function(sequelize, DataTypes) {
|   var _yourTableName = sequelize.define('모델명', { 특성 }, { 옵션 });
|   return _yourTableName;
| };
*/
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
      idx      : { type : DataTypes.INTEGER(11), primaryKey: true
                 , autoIncrement: true }
    , id       : { type : DataTypes.STRING(50), allowNull: false
                 , validate : { is: ["^[a-z0-9_-]+$",'i'] } }
    , pass     : { type : DataTypes.STRING(200), allowNull: false }
    , name     : { type : DataTypes.STRING(50) }
    , tel      : { type : DataTypes.STRING(20) }
    , phone    : { type : DataTypes.STRING(20) }
    , email    : { type : DataTypes.STRING(100)
                 , validate : { isEmail: true } }
    , birth    : { type : DataTypes.DATEONLY
                 , validate : { isDate: true } }
    , reg_date : { type : DataTypes.DATEONLY
                 , validate : { isDate: true }
                 , defaultValue : DataTypes.NOW }
    , ip       : { type : DataTypes.STRING(15)
                 , validate : { isIP: true } }
  }, {
	    timestamps: false
	  , tableName: 'user'
  });
};
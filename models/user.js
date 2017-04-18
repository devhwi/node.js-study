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
    , id       : { type : DataTypes.STRING(50)
                 , validate : { is: ["^[a-z0-9_-]+$",'i'] } }
    , pass     : { type : DataTypes.STRING(200) }
    , name     : { type : DataTypes.STRING(50), allowNull: true }
    , tel      : { type : DataTypes.STRING(20), allowNull: true }
    , phone    : { type : DataTypes.STRING(20), allowNull: true }
    , email    : { type : DataTypes.STRING(100), allowNull: true
                 , validate : { isEmail: true } }
    , birth    : { type : DataTypes.DATEONLY, allowNull: true
                 , validate : { isDate: true } }
    , reg_date : { type : DataTypes.DATEONLY
                 , validate : { isDate: true } }
    , ip       : { type : DataTypes.STRING(15), allowNull: true
                 , validate : { isIP: true } }
  }, {
	  timestamps: false,
	  tableName: 'user'
  });
};
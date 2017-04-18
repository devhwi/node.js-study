/*
| module.exports = function(sequelize, DataTypes) {
|   var _yourTableName = sequelize.define('모델명', { 특성 }, { 옵션 });
|   return _yourTableName;
| };
*/
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('attendance', {
      date      : { type : DataTypes.DATEONLY, primaryKey: true
                 , validate : { isDate: true } }
    , file_name : { type : DataTypes.STRING(100) }
  }, {
	  timestamps: false,
    tableName: 'attendance'
  });
};
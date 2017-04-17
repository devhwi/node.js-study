/*
| module.exports = function(sequelize, DataTypes) {
|   var _yourTableName = sequelize.define('모델명', { 특성 }, { 옵션 });
|   return _yourTableName;
| };
*/
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('attendance', {
      user_id         : { type : DataTypes.STRING(20), primaryKey: true }
    , attendance_date : { type : DataTypes.DATEONLY, primaryKey: true }
  }, {
	  timestamps: false,
    tableName: 'attendance'
  });
};
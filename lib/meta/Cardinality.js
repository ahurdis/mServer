var Cardinality = Object.freeze 
({
  ONE_ONE: '1..1', 
  ZERO_MANY: '0..*',
  ZERO_ONE_MANY: '0,1..*',
  ONE_MANY: '1..*',
  MANY_MANY: '*..*'
});

module.exports = Cardinality;

function MultiMap()
{
    let self = this;
    let content = {};
 
    self.add = function(key, value) {
        if (content[key] === undefined) content[key] = [];
        content[key].push(value);
        return self;
    };
 
    self.get = function(key) {
        return content[key];
    };

    self.keys = function() {
        return Object.keys(content);
    };
};

module.exports = MultiMap;
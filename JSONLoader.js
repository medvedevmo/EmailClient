const fs = require('fs');

module.exports = {
    readJSON : function(path) {
        return JSON.parse(fs.readFileSync(path));
    },
    readKeyJSON : function(path, key) {
        let data = JSON.parse(fs.readFileSync(path));
        const keys = key.split("&");
        for (let i = 0; i < keys.length; i++) {
            data = data[keys[i]];
        }
        return data;
    },
    changeJSON : function(path, key, value) {
        const data = JSON.parse(fs.readFileSync(path));
        data[key] = value;
        fs.writeFileSync(path, JSON.stringify(data, null, 4));
    },
    changeKeysJSON : function(path, key, value) {
        let data = JSON.parse(fs.readFileSync(path));
        let keys = key.split("&");
        data[keys[0]][keys[1]] = value;
        fs.writeFileSync(path, JSON.stringify(data, null, 4));
    }
}
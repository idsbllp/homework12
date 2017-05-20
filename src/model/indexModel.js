const {watcher} = require('../watcher/watcher.js');

export default class Model {
    constructor() {
        this.models = [];
    }
    regist(obj, key, callback) {
        const hasModel = this.models.find(model => {
            if (model.key.toString() == key.toString()) {
                return model;
            }
        });
        // console.log(hasModel);
        if (hasModel) {
            hasModel.callback.push(callback);
        } else {
            this.models.push({
                obj,
                key,
                callback: [callback]
            });
        }
    }
    build() {
        // console.log(this.models);
        this.models.forEach(model => {
            watcher(model.obj, model.key, model.callback)
        });
    }
}
// 12314
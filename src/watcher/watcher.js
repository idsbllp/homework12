function watcher(obj, key, callback) {
    if (Object.prototype.toString.call(key) === '[object Array]') {
        watchPath(obj, key, callback);
    } else {
        let old = obj[key];
        if (Object.prototype.toString.call(old) === '[object Array]') {
            watchArray(old, callback);
        } else if (Object.prototype.toString.call(old) === '[object Object]') {
            watchAllKey(old, callback)
        } else {
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: function() {
                    return old;
                },
                set: function(now) {
                    if (now !== old) {
                        callback.forEach((fn) => {
                            fn(old, now);
                        });
                    }
                    old = now;
                }
            });
        }
    }
}

function watchPath(obj, keyArray, callback) {
    let path = obj;
    let _key;
    const keyLength = keyArray.length;

    // 获取
    keyArray.forEach((key, idx) => {
        if (idx < keyLength-1) {
            path = path[key];
        } else {
            _key = key;
        }
    });

    watcher(path, _key, callback);
}

function watchArray(arr, callback) {
    const oam = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
    const arrayProto = Array.prototype;
    const hackProto = Object.create(Array.prototype);

    oam.forEach(function(method) {
        Object.defineProperty(hackProto, method, {
            writable: true,
            enumerable: true,
            configurable: true,
            // [12, 32] => 12, 32
            value: function(...arg) {
                let old = arr.slice();
                let now = arrayProto[method].call(this, ...arg);
                callback.forEach((fn) => {
                    fn(old, this, ...arg);
                })
                return now;
            },
        })
    })
    arr.__proto__ = hackProto
}

function watchAllKey(obj, callback) {
    Object.keys(obj).forEach(function(key){
       watcher(obj, key, callback)
    });
}
module.exports = {
    watcher,
}
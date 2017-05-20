import {$} from '../utils/utils.js';
import Model from '../model/indexModel.js';

class Mvvm {
    constructor(el, data) {
        this.index = 1;

        this.data = data;
        this.el = $(el);
        
        // 转data为model
        this.model = new Model();

        // 遍历
        this.scan(this.el);

        this.model.build();
    }
    scan(node, index = undefined) {
        // 如果不是列表
        if (node && !node.dataset.list){
            const NodeListLen = node.children.length;
            for (let i = 0; i < NodeListLen; i++) {
                const thisNode = node.children[i];

                // 渲染数据 可添加其他的，条件渲染，比较渲染等。
                this.parseModel(thisNode, index);
                this.parseClass(thisNode, index);
                this.parseEvent(thisNode, index);

                // 如果还有子元素，递归
                if (NodeListLen) {
                    this.scan(thisNode);
                }
            }
        } else {
            this.parseList(node);
        }
    }
    // 格式化数据: 嵌套对象，数组
    parseData(dataPath, index, node) {
        const dataList = dataPath.split(':');
        let resData = null;
        let path = [];
        // 获取嵌套对象的值
        dataList.forEach((dataKey, idx) => {
            if (resData && resData.length) {
                resData = resData[index-1];
                path.push(index-1);
            }
            if (idx === 0) {
                resData = this.data[dataKey];
                path.push(dataKey);
            } else {
                resData = resData[dataKey];
                path.push(dataKey);
            }
        });
        return resData;
    }
    // 渲染数据
    parseModel(node, index) {
        // {title: 'haha'}
        const modelName = node.dataset.model; // title
        if (modelName) {
            const _data = this.parseData(modelName, index);
            if (this.index <= 2) {
                this.index++;
            }
            // input textarea
            if (node.nodeName.toUpperCase() === 'INPUT') {
                node.value = _data;
            } else {
                node.innerText = _data;
            }
            this.model.regist(this.data, modelName.split(':'), (old, now) => {
                if (node.nodeName.toUpperCase() === 'INPUT') {
                    node.value = now;
                } else {
                    node.innerText = now;
                }
            });
        }
    }
    // 渲染 class
    parseClass(node, index) {
        const className = node.dataset['class'];
        if (className) {
            const _data = this.parseData(className, index);
            if (!node.classList.contains(_data)) {
                node.classList.add(_data);
            }
            
            this.model.regist(this.data, className.split(':'), (old, now) => {
                node.classList.remove(old);
                if (!node.classList.contains(now)) {
                    node.classList.add(now);
                }
            });
        }
    }

    parseEvent(node) {
        //TODO:解析事件
        // console.log('asd');
    }
    // 渲染列表
    parseList(node) {
        this.parseModel(node);
        this.parseClass(node);
        this.parseEvent(node);

        const parentNode = node.parentNode;
        // 获取数组数据
        const listName = node.dataset.list;
        const listData = this.parseData(listName, undefined, node);

        node.removeAttribute('data-list');

        listData.forEach((data, idx) => {
            const copyNode = node.cloneNode(true);
            if (node.path) {
                copyNode.path = node.path.slice()
            }
            if (!copyNode.path) {
                copyNode.path = [];
            }
            // console.log([listName, idx]);
            copyNode.path.push([data, idx]);
            
            this.scan(copyNode, idx+1);
            parentNode.appendChild(copyNode);
        });
        parentNode.removeChild(node);

        // this.model.regist(this.data, listName.split(':'), (old, now) => {
        //     node.classList.remove(old);
        //     if (!node.classList.contains(now)) {
        //         node.classList.add(now);
        //     }
        // });
    }
}

module.exports = {
    Mvvm
}





























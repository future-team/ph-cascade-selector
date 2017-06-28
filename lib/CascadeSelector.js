'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _cssCascadeSelectorLess = require('../css/CascadeSelector.less');

var _cssCascadeSelectorLess2 = _interopRequireDefault(_cssCascadeSelectorLess);

var CascadeSelector = (function (_Component) {
    _inherits(CascadeSelector, _Component);

    function CascadeSelector(props, context) {
        _classCallCheck(this, CascadeSelector);

        _Component.call(this, props, context);
        this.state = {
            tappedIndexArray: [],
            hashKey: ''
        };
        var pathMap = {};
        var selectorData = this.props.selectorData;

        //this.generateTreePathMap('',selectorData,pathMap);
        this.pathMap = pathMap;
        this.hashId = this.uniqueId();
        this.preHash = '';
    }

    CascadeSelector.prototype.preAndCurHashIndex = function preAndCurHashIndex() {
        var self = this;
        function calculateHashIndex(hash) {
            var hashIndex = 0;
            if (hash) {
                var hashSegs = hash.split('_');
                if (hashSegs.length > 1) {
                    if ('#' + self.hashId + '_' + hashSegs[1] == hash) {
                        hashIndex = hashSegs[1];
                    }
                }
            }
            return hashIndex;
        }
        var preHash = self.preHash,
            curHash = location.hash,
            preHashIndex = calculateHashIndex(preHash),
            curHashIndex = calculateHashIndex(curHash);
        this.preHash = location.hash;
        return {
            preHashIndex: preHashIndex,
            curHashIndex: curHashIndex
        };
    };

    CascadeSelector.prototype.componentDidMount = function componentDidMount() {
        var self = this;
        window.onhashchange = function () {
            var _self$preAndCurHashIndex = self.preAndCurHashIndex();

            var preHashIndex = _self$preAndCurHashIndex.preHashIndex;
            var curHashIndex = _self$preAndCurHashIndex.curHashIndex;

            //console.log('p,c',preHashIndex,curHashIndex);
            //用于处理用户点击返回按钮，这个时候需要监听hashChange事件，手动去设置hashKey和tappedIndexArray
            if (preHashIndex - curHashIndex > 0) {
                var tappedIndexArray = self.state.tappedIndexArray.slice();
                tappedIndexArray.pop();
                if (curHashIndex == 0) {
                    //当curHashIndex＝0时，可能是用户点了会退按钮，pop不存在任何问题，当用户点击了子节点，会直接跳到0，
                    // 此时pop会存在删不干净的情况，需要手动置空tappedIndexArray
                    tappedIndexArray.length = 0;
                }
                //console.log(tappedIndexArray);
                self.setState({
                    hashKey: curHashIndex,
                    tappedIndexArray: tappedIndexArray
                });
            }
        };
    };

    CascadeSelector.prototype.uniqueId = function uniqueId() {
        return new Date().getTime() + (Math.random() * 1e5).toFixed(0);
    };

    CascadeSelector.prototype.generateTreePathMap = function generateTreePathMap(path, list, pathMap) {
        var self = this;
        if (list && list.length) {
            list.forEach(function (item, index) {
                var currentPath = path,
                    itemChildren = item.children;
                if (currentPath) {
                    currentPath = currentPath + ',' + index;
                } else {
                    currentPath = '' + index;
                }
                var _self$props = self.props;
                var itemKey = _self$props.itemKey;
                var selectedId = _self$props.selectedId;

                pathMap[item[itemKey]] = currentPath;
                //if(selectedId&&item[itemKey]==selectedId){
                //    self.selectedItem=item;
                //}
                if (itemChildren && itemChildren.length) {
                    self.generateTreePathMap(currentPath, itemChildren, pathMap);
                }
            });
        }
    };

    CascadeSelector.prototype.branchNodeClick = function branchNodeClick(item, index, selectorLevel) {
        var _props$itemClick;

        var tappedIndexArray = this.state.tappedIndexArray;

        tappedIndexArray.push(index);
        var hashKey = selectorLevel + 2;
        this.setState({
            tappedIndexArray: tappedIndexArray,
            hashKey: hashKey
        });
        location.hash = '#' + this.hashId + '_' + hashKey;
        this.props.itemClick && this.props.itemClick((_props$itemClick = {}, _props$itemClick[this.props.itemKey] = item[this.props.itemKey], _props$itemClick[this.props.itemValue] = item[this.props.itemValue], _props$itemClick[this.props.itemLevel] = item[this.props.itemLevel], _props$itemClick.nodeType = 'branch', _props$itemClick));
    };

    CascadeSelector.prototype.leafNodeClick = function leafNodeClick(item, index) {
        var _props$itemClick2;

        var preHashKey = this.state.hashKey;
        //执行会退操作，hashChange会负责state的变化
        this.selectedItem = item;
        window.history.go(-preHashKey);
        this.props.itemClick && this.props.itemClick((_props$itemClick2 = {}, _props$itemClick2[this.props.itemKey] = item[this.props.itemKey], _props$itemClick2[this.props.itemValue] = item[this.props.itemValue], _props$itemClick2[this.props.itemLevel] = item[this.props.itemLevel], _props$itemClick2.nodeType = 'leaf', _props$itemClick2));
    };

    CascadeSelector.prototype.render = function render() {
        var self = this;
        var selectorData = this.props.selectorData;
        var _state = this.state;
        var tappedIndexArray = _state.tappedIndexArray;
        var hashKey = _state.hashKey;
        var itemList = selectorData;
        var panelList = [selectorData];
        var curLabel = '';
        var selectorDataEmpty = !(selectorData && selectorData.length);
        for (var i = 0; i < tappedIndexArray.length; i++) {
            panelList.push(itemList[tappedIndexArray[i]].children);
            itemList = itemList[tappedIndexArray[i]].children;
        }
        //优先判断this中的selectedItem，没有的话再判断props中的selectdItem
        if (self.selectedItem) {
            curLabel = self.selectedItem[self.props.itemValue];
        } else {
            if (self.props.selectedItem) {
                curLabel = self.props.selectedItem[self.props.itemValue];
            }
        }
        return _react2['default'].createElement(
            'div',
            { className: 'cascade-selector' },
            hashKey == '' ? _react2['default'].createElement(
                'div',
                { className: 'cs-item item-branch' + (selectorDataEmpty ? ' disabled' : ''),
                    onClick: function () {
                        if (selectorDataEmpty) {
                            self.props.emptyCallback && self.props.emptyCallback();
                            return;
                        }
                        self.setState({
                            hashKey: 1,
                            tappedIndexArray: []
                        });
                        location.hash = '#' + self.hashId + '_' + 1;
                    } },
                this.props.label,
                curLabel ? _react2['default'].createElement(
                    'span',
                    { className: 'selected-content' },
                    curLabel
                ) : _react2['default'].createElement(
                    'span',
                    { className: 'item-tip' },
                    '请选择'
                )
            ) : panelList.map(function (itemList, selectorLevel) {
                return _react2['default'].createElement(
                    'div',
                    { key: 'selector-' + selectorLevel,
                        className: 'cs-panel',
                        style: { display: selectorLevel == tappedIndexArray.length ? 'block' : 'none' } },
                    itemList.map(function (item, itemIndex) {
                        return _react2['default'].createElement(
                            'div',
                            { className: 'cs-item' + (item.children && item.children.length ? ' item-branch' : ' item-leaf') + (self.selectedItem && item[self.props.itemKey] == self.selectedItem[self.props.itemKey] ? ' active' : ''),
                                key: item[self.props.itemKey],
                                onClick: function () {
                                    if (item.children && item.children.length) {
                                        self.branchNodeClick(item, itemIndex, selectorLevel);
                                    } else {
                                        self.leafNodeClick(item, itemIndex, selectorLevel);
                                    }
                                } },
                            _react2['default'].createElement('span', { className: 'checkbox' }),
                            _react2['default'].createElement(
                                'span',
                                { className: 'item-content' },
                                item[self.props.itemValue]
                            )
                        );
                    })
                );
            })
        );
    };

    _createClass(CascadeSelector, null, [{
        key: 'defaultProps',
        value: {
            label: '级联选择',
            itemKey: 'typeId',
            itemValue: 'typeName',
            itemLevel: 'level'
        },
        enumerable: true
    }]);

    return CascadeSelector;
})(_react.Component);

exports['default'] = CascadeSelector;
module.exports = exports['default'];
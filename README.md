# ph-cascade-selector

级联选择
```jsx
<CascadeSelector    selectorData={this.state.selectorData}
                    itemClick={function(item){
                        console.log(item);
                    }}
                    label='选择问题分类'>
</CascadeSelector>
```
回调返回值如下：
```js
 {typeId: 1000024, typeName: "ppe测试", nodeType: "leaf"}
 {typeId: 8, typeName: "页面展示/排序", nodeType: "branch"}
```

##  API
View [example](/example/src/index.js) to get more details

#### `<CascadeSelector>` Props:
- selectorData 级联选择的数据 .
- itemClick 每当item被选择（不论叶子节点还是树枝节点被选中），都会调用itemClick回调，nodeType用来区分哪个类型的节点被选择.
- label 用户没有选择任何item时，默认展示的文字.



### Contributing

- Fork the project
- Run the project in development view demo: `$ npm run demo`
- Make changes.
- Add appropriate tests
- `$ npm run test`
- If tests don't pass, make them pass.
- Update README with appropriate docs.
- Rnn build
- `$ npm run build`
- Commit and PR.



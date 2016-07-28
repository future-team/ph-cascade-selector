
import React,{PropTypes,Component} from 'react';

import uploadStyle from '../css/CascadeSelector.less';

export default class CascadeSelector extends Component{
    constructor(props,context){
        super(props,context);
        this.state={
            tappedIndexArray:[],
            hashKey:''
        };
        let pathMap={

        }
        let {selectorData}=this.props;
        //this.generateTreePathMap('',selectorData,pathMap);
        this.pathMap=pathMap;
        this.hashId=this.uniqueId();
        this.preHash='';
    }
    static defaultProps={
        label:'级联选择',
        itemKey:'typeId',
        itemValue:'typeName'
    };
    preAndCurHashIndex(){
        let self=this;
        function calculateHashIndex(hash){
            let hashIndex=0;
            if(hash){
                let hashSegs=hash.split('_');
                if (hashSegs.length>1){
                    if('#'+self.hashId+'_'+hashSegs[1]==hash){
                        hashIndex=hashSegs[1]
                    }
                }
            }
            return hashIndex;
        }
        let preHash=self.preHash,
            curHash=location.hash,
            preHashIndex=calculateHashIndex(preHash),
            curHashIndex=calculateHashIndex(curHash);
            this.preHash=location.hash;
        return {
            preHashIndex,
            curHashIndex
        }
    }
    componentDidMount(){
        let self=this;
        window.onhashchange=function(){
            var {preHashIndex,curHashIndex}=self.preAndCurHashIndex();
            //console.log('p,c',preHashIndex,curHashIndex);
            //用于处理用户点击返回按钮，这个时候需要监听hashChange事件，手动去设置hashKey和tappedIndexArray
            if(preHashIndex-curHashIndex>0){
                let tappedIndexArray=self.state.tappedIndexArray.slice();
                tappedIndexArray.pop();
                if(curHashIndex==0){
                    //当curHashIndex＝0时，可能是用户点了会退按钮，pop不存在任何问题，当用户点击了子节点，会直接跳到0，
                    // 此时pop会存在删不干净的情况，需要手动置空tappedIndexArray
                    tappedIndexArray.length=0;
                }
                //console.log(tappedIndexArray);
                self.setState({
                    hashKey: curHashIndex,
                    tappedIndexArray
                });
            }
        }
    }
    uniqueId(){
        return (new Date().getTime()+(Math.random()*1e5).toFixed(0));
    }
    generateTreePathMap(path,list,pathMap){
        var self=this;
        if(list&&list.length){
            list.forEach((item,index)=>{
                let currentPath=path,
                    itemChildren=item.children;
                if(currentPath){
                    currentPath=currentPath+','+index
                }else{
                    currentPath=''+index
                }
                let {itemKey,selectedId}=self.props;
                pathMap[item[itemKey]]=currentPath;
                //if(selectedId&&item[itemKey]==selectedId){
                //    self.selectedItem=item;
                //}
                if(itemChildren&&itemChildren.length){
                    self.generateTreePathMap(currentPath,itemChildren,pathMap);
                }
            });
        }
    }

    branchNodeClick(item,index,selectorLevel){
        let {tappedIndexArray}=this.state;
        tappedIndexArray.push(index);
        let hashKey=selectorLevel+2;
        this.setState({
            tappedIndexArray,
            hashKey
        })
        location.hash='#'+this.hashId+'_'+hashKey;
        this.props.itemClick&&this.props.itemClick({
            [this.props.itemKey]:item[this.props.itemKey],
            [this.props.itemValue]:item[this.props.itemValue],
            nodeType:'branch'
        })
    }
    leafNodeClick(item,index){
        let preHashKey=this.state.hashKey;
        //执行会退操作，hashChange会负责state的变化
        this.selectedItem=item;
        window.history.go(-preHashKey);
        this.props.itemClick&&this.props.itemClick({
            [this.props.itemKey]:item[this.props.itemKey],
            [this.props.itemValue]:item[this.props.itemValue],
            nodeType:'leaf'
        })
    }
    render(){
        let self=this,
            {selectorData}=this.props,
            {tappedIndexArray,hashKey}=this.state,
            itemList=selectorData,
            panelList=[selectorData];
        for(var i=0;i<tappedIndexArray.length;i++){
            panelList.push(itemList[tappedIndexArray[i]].children)
            itemList=itemList[tappedIndexArray[i]].children;
        }
        return(
            <div className='cascade-selector'>
                {
                    hashKey==''?
                        <div className='cs-item item-branch'
                             onClick={()=>{
                                self.setState({
                                    hashKey:1,
                                    tappedIndexArray:[]
                                })
                                location.hash='#'+self.hashId+'_'+1;
                            }}>
                            {self.selectedItem?self.selectedItem[self.props.itemValue]:this.props.label}
                            <span className='item-tip'>请选择</span>
                        </div>
                        :
                    panelList.map((itemList,selectorLevel)=>{
                        return (<div key={'selector-'+selectorLevel}
                                     className='cs-panel'
                                     style={{display:selectorLevel==tappedIndexArray.length?'block':'none'}}>
                            {
                                itemList.map((item,itemIndex)=>{
                                    return (
                                        <div className={'cs-item'
                                             +(item.children&&item.children.length?' item-branch':' item-leaf')
                                             +(self.selectedItem&&item[self.props.itemKey]==self.selectedItem[self.props.itemKey]?' active':'')}
                                             key={item[self.props.itemKey]}
                                             onClick={()=>{
                                                if(item.children&&item.children.length){
                                                    self.branchNodeClick(item,itemIndex,selectorLevel)
                                                }else{
                                                    self.leafNodeClick(item,itemIndex,selectorLevel)
                                                }
                                            }}>
                                                <span className='checkbox'>
                                                </span>
                                                <span className='item-content'>
                                                    {item[self.props.itemValue]}
                                                </span>
                                        </div>
                                    );
                                })
                            }
                        </div>)

                    })
                }
            </div>
        )
    }
}
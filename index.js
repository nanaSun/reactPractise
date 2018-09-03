import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
let element=(<div className="element">hello world<span>aaa</span>aaa</div>)
console.log(element)
function  render(el,root) {
    let {type,props}=el
    let {children}=props
    let node=document.createElement(type)
    console.log(children)
    if(typeof children==="string"){
        node.innerHTML=children
    }else{
        for(let child of children){
            if(typeof child==="string"){
                node.innerHTML= node.innerHTML+child
            }else{
                render(child,node)
            }
            
        }
    }
    root.appendChild(node)
}
render(element,document.getElementById('root'))
//ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

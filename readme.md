# 学习React从接受JSX开始

 详情参考官方[JSX规范](https://facebook.github.io/jsx/)


>虽然JSX是扩展到ECMAScript的类XML语法，但是它本身并没有定义任何语义。也就是说它本身不在ECMAScript标准范围之内。它也不会被引擎或者浏览器直接执行。通常会利用很编译器预处理器来将这些JSX转化为标准的ECMAScript。

吐槽：虽然JSX出发点是好的，而且写起来也很简单，但是对于要在JS中写类HTML格式的内容，我的内心是排斥的，感觉非常不习惯。这不是我熟知的web开发啊！有种在开发app的感觉，一个个自定义的组件。

想看看他是怎么编译JSX，于是我看了下用JS的写法写组件，主要的方法就是`React.createElement`：
```
React.createElement(
  type,
  [props],
  [...children]
)
```
第一个参数`type`是类型，也就是名字，比如`h1`、`div`、`自定义组件名`等~
第二个参数`[props]`其实就是各种属性，我们在JS中怎么写属性的，在这里就怎么写。比如`img.src=""`,`div.className=""`这样的，那么属性就是这么写的`{className:"",src:""}`，属性名和JS保持一致。
第三个参数，其实就是无限延展当前节点的子节点，你想有多少个就有多少个。

来看一眼官方文档的转化，这个是我用`React.createElement`来转义的JSX，这样一个套一个的写法，什么时候才是个头。强烈的求生欲使我放弃了JS的写法，转投JSX的写法了：

![](https://user-gold-cdn.xitu.io/2018/9/3/1659e8e5f2d0f95c?w=1859&h=709&f=png&s=57247)

相比较这种无限嵌套的写法，JSX友善太多了。从语义化的角度来说，JSX的可读性也是很好滴。（为自己学习JSX强行找理由。）

## 深入了解JSX的对象

上一节提到，

```
let element=<h1 className="aaa">A爆了</h1>
//等同于
let element=React.createElement(
  "h1",
  {className:"aaa"},
  "A爆了"
)
```

那么是不是我直接`let {type,props,children}=element`就可以得到 `h1`、`{className:"aaa"}`和`A爆了`了呢？我还是太天真了。`type`确实是`h1`，但是`props`打出来是`{className: "aaa", children: "A爆了"}`。咦？怎么`children`混在了这里，那么后面得children呢？毫无疑问`undefined`。也就是说一个`React.createElement`或者JSX的对象的结构是这样的：

```
{
    type:"h1",
    props:{
        className:"aaa",
        children:"A爆了"
    }
}
```
## JSX的花式写法（内含错误演示）

JSX有许多中写法，看的我是眼花缭乱，不如来分析分析这些写法的奥秘，为什么要这么写，然后找一种自己喜欢的方式来写。这里我会以`let element=XXX`为例子，然后大家可以直接`ReactDOM.render(element, document.getElementById('root'));`这样渲染。

### 写法一：一个标签内嵌纯文字

我习惯在写JS的时候，将这些标签写在字符串中，然后拼接起来。看到这么写，真的觉得是个bug，浏览器一定会报错的！然而在react中，不会报错的，这是正确的。

```
let element=<h1 className="aaa">A爆了</h1>
ReactDOM.render(element, document.getElementById('root'));
```

#### 错误写法演示：无标签纯文字

那如果是纯文字呢？华丽丽地报错了。说名JSX还是需要标签包裹的。

```
let element=A爆了
```

### 写法二：一个标签嵌套标签混合文字

那么我们多加几个子元素进，也是OK的，没什么毛病。

```
let element=<h1 className="aaa">aaa<span>A爆了</span>bbbb</h1>
```

### 写法三：Fragment包裹所有！

#### 错误写法演示：多个标签并列

如果是很多个并列地兄弟节点呢？突然兴奋！报错了~果然不能皮。为什么呢？大家都是正正经经的HTML标签啊。

```
let element=
    <h1 className="aaa">A爆了</h1>
    <h1 className="aaa">A爆</h1>
```

![](https://user-gold-cdn.xitu.io/2018/9/4/165a371f4e08f5e1?w=868&h=181&f=png&s=17166)

官方给出的解释是：必须包裹在一个闭合的标签内。意思就是说不能N个闭合标签并列吗？

```
let element=
<div>
    <h1 className="aaa">A爆了</h1>
    <h1 className="aaa">A爆</h1>
</div>
```

外面多加一层div就可以。可是这样可能会多出很多个不需要的div啊，我们干干净净的HTML，会不会变成嵌套地狱啊。官方的求生欲也是很强的，早就想到了这一点，所以有一个官方的组件叫做`Fragment`。专门用于包裹这些不需要多加一层div的元素们。这个组件的用法：

```
//首先别忘了导入，不然直接React.Fragment也是可以的
import React,{Fragment} from 'react';
//然后
let element=
<Fragment>
    <h1 className="aaa">A爆了</h1>
    <h1 className="aaa">A爆</h1>
</Fragment>
```

前面提到了`element`打印的结构：`{type:"h1",props:{className:"aaa",children:"A爆了"}}`，好奇心旺盛的我打印了下`<Fragment>`的`element`是什么样的。结果如下所示，`type:Symbol(react.fragment)`，虽然这个根节点是特殊的标签，不是`div`,`p`这种正正经经的HTML标签，但也是一个节点了。也就是说`element`相当于一个根节点，这个根节点只能有一个，然后这个根节点可以有无数的子节点。

```
{
    type:Symbol(react.fragment),
    props:{
        children:[
        {type: "h1", props: {…}}
        {type: "h1", props: {…}}
    ]
}
```
写法四：数组真的不行吗？

好奇心旺盛的我，不愿意屈服于所有的外面都要加一个标签包裹，文档说的是一个闭合的标签，那么`[]`这样包裹一个数组可不可以呢？wow~没有报错！也就是说闭合标签不一定指代`<></>`也可以是`[]`，来代表一个整体。

```
let element=
    [
        <li>1</li>,
        <li>1</li>,
        <li>1</li>
    ]
```

写法五：长的好看而已

我还看到一种写法，就是在最外层加上`()`来包裹整个节点。我一开始以为这是什么骚操作，会让`element`变得与众不同。于是，我做了个实验，将两个一样的节点进行对比，不同点在于第一个无`()`，第二个有`()`，然后结果是`true`，也就是说他们本质上没啥不同。所以小伙伴们，不写`()`也不会报错的。

```
let element=<div><h1 className="aaa">A爆了</h1><h1 className="aaa">A爆</h1></div>
let element1=(<div><h1 className="aaa">A爆了</h1><h1 className="aaa">A爆</h1></div>)
console.log(JSON.stringify(element1)===JSON.stringify(element))
```

那么这个括号有什么用呢？当然有！好看！我们来看一样`Component`里面的`render`如果没有`()`会怎么样。

```
render() {
    return (
        <div className="App">
            <p className="App-intro">To get started, edit<code>src/App.js</code> and save to reload.</p>
        </div>
    )
}
```

原本是有`()`的，然后可以换行，把节点排排整齐。看着也很舒服。然后我们把`()`去了会怎么样？整齐是整齐，但是会报错啊！

```
render() {
    return 
        <div className="App">
        .....
}
```

这里就有一个小知识点，js语言设计中`return`的内容必须一行完成，不要跟回车，不然就会报错。（真是任性的操作）也就是说像下方这么写就没有问题。但是我就没办法保证整整齐齐的标签了啊！这个排版怎么排都丑。所以这个时候`()`就展现出了他的魅力，代表了一个整体，告诉`return`我还没结束。所以大家也不要被`()`给迷惑了，不要怕他。


```
render() {
    return <div className="App">
        .....
}
```

## JSX中的标签属性

写JSX会发现，虽然我是在写HTML，但是有些属性好奇怪啊，经常写错，比如最常见的`className`。我总结出一点我们写标签的时候是HTML，写属性的时候要用JS思维。这样就不复杂，也不难记拉！

```
\\JS中怎么取class属性的呢？
document.getElementById('myid').className
\\遇到特殊的<label id="label" for="xxx"></label>，这个for在JS中怎么获取呢？
document.getElementById('label').htmlFor
```

那么问题来了，有一个名为`style`的属性，你要怎么处理？`style`就比较复杂了，他不是一个值一个字符串能够搞定搞定的。我先在报错的边缘试探下吧。

试探一：字符串！

```
let element=<div style="color:green">A爆</div>
```
报错啦！报错啦！官方提示我们`The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.`也就是说`style`需要从样式属性映射到他的值，字符串是不可以的。所以就需要`{marginRight: spacing + 'em'}`像这样的对象才可以。那为什么要再加一层`{}`?

试探二：单层`{}`

```
let element=<div style={color:"green"}>A爆</div>
```

直接编译错误了。也就是说JSX中不能直接包含JS的函数。而要用`{}`包裹起来JS函数。所以才有了双层`{}`。第一层是代表我是JS，第二层其实就是属性对象本身了。大家不用再试探底线了老老实实：

```
let element=<div style={{color:"green"}}>A爆</div>
```

如果想再JSX中加注释怎么办？直接`<!--XXX-->`肯定报错囧。我们可以用`{/*XXX*/}`的方式注释，因为`{}`标签里面是js函数，我们用JS的注释就OK拉！（其实JSX还是JS啊。）

## JSX中使用JS

上文提到`{}`中包含的是JS，那么我们是不是可以玩出更多的花样的？因为`{}`中我们就可以用JS为所欲为了！

比如循环（正确）：
```
let arr=[1,2,3]
let element=(
    {arr.map((v,i)=>
        <div>{v}-A爆</div>
    )}
)
```

如果不想循环直接`return`，可以这样，内部加上大括号，再继续写额外操作。别忘了`return`，只有`=>`函数可以省去`return`

```
let arr=[1,2,3]
let element=(
    <Fragment>
        {arr.map((v,i)=>{
            if(v===1){
                return <span>A爆了</span>
            }else{
                return <span>B爆了</span>
            }
        })}
    </Fragment>
)
```

但是如果JS在标签`<></>`外部的话，就可以直接使用，而不用加上`{}`：

```
let element=
    arr.map((v,i)=>{
        if(v==1){
            return <div>{v}-A爆</div>
        }else{
            return <div>{v}-B爆</div>
        }
    })
```

大家注意了，这里无论如何`element`都是一个对象，所以赋予他的值也只能是对象。所以不能直接if/else进行操作，建议再JSX外层操作，而不是直接再JSX中的外层操作。

比如这样，那就只能等吃红牌了。

```
let element=(
    if(v===1){
        return <span>A爆了</span>
    }else{
        return <span>B爆了</span>
    }
)
```

最好是这样：

```
let v=1;
let element;
if(v===1)
    element=<span>A爆了</span>
}else{
    element=<span>B爆了</span>
}
```

在Comopent的render中，我么可以这么写：

```
render() {
    if(v===1){
        return <span>A爆了</span>      
    }else{
        return <span>B爆了</span>
    }
}
```

**研究完之后，发现JSX就是JS啊，以及每次用JSX“语法”写的元素，都要返回一个数组或者是对象。只要牢记这一点，就可以玩转JSX。**
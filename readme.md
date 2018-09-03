# 学习React从接受JSX开始

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

知道了这个对象的结构，我们可以尝试一波，自己写一个`render`替代`ReactDOM.render`，把这个节点写到页面上。



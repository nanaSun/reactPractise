# react组件之间的沟通方式

先来几个术语：
|官方|我|对应代码|
|:--:|:--:|:--:|
|React element|React元素|`let element=<span>A爆了</span>`|
|Component|组件|`class App extends React.Component {}`|


上回说到JSX的用法，这回要开讲react组件之间的一个沟通。那么什么是组件？我知道英文是Component，但这对我而言就是一个单词，毫无意义。要了解Component之间是如何进行友好交流的，那就要先了解Component是个什么鬼。

上回说到的JSX，我们可以这么创建对象：

```
let element=<h1 className="aaa">A爆了</h1>
//等同于
let element=React.createElement(
  "h1",
  {className:"aaa"},
  "A爆了"
)
```

还是老老实实地用`h1`、`div`这种标准的HTML标签元素去生成React元素。但是这样的话，我们的JS就会变得巨大无比，全部都是新建的React元素，有可能到时候我们连对象名都不晓得怎么起了，也许就变成`let div1;let div2`这样的。哈哈哈开个玩笑。但是分离是肯定要分离的。这个时候就有了名为Component的概念。他可以做些什么呢？简单的说就是创建一个个`独立的`，`可复用`的小组件。话不多说，我们来瞅瞅来自官方的写法：

写法一：函数型创建组件，大家可以看到我就直接定义一个名为App的方法，每次执行`App()`的时候就会返回一个新的React元素。而这个方法我们可以称之为组件Component。有些已经上手React的朋友，可能傻了了，这是什么操作，我的高大上`class`呢？`extend`呢？很遗憾地告诉你，这也是组件，因为他符合官方定义：1、传入了一个“props” ，2、返回了一个React元素。满足上述两个条件就是Component！

```
function App(props) {
  return <span>{props.name}！A爆了</span>     
}
```

这个是最简易的`Component`了，在我看来`Component`本身是对`React.createElement`的一种封装，他的`render`方法就相当于`React.createElement`的功能。高大上的组件功能来啦：

```
import React, { Component } from 'react';
class App extends Component {
  render() {
    return <span>{this.props.name}！A爆了</span>     
  }
}
export default App;
```

这个`class`版本的组件和上方纯方法的组件，从React的角度上来说，并无不同，但是！毕竟我`class`的方式还继承了`React.Component`，不多点小功能都说不过去对吧？所以说我们这么想继承了`React.Component`的组件的初始功能要比纯方法return的要多。所以每个React的`Component`我们都可以当作React元素直接使用。

分析了Component之后，大家有没有发现Component的一个局限？没错！就是传参！关于Component的一个定义就是，只能传入`props`的参数。也就是说所有的沟通都要在这个`props`中进行。有种探监的既视感，只能在规定的窗口，拿着对讲机聊天，其他的方式无法沟通。React对于`props`有着苛刻的规定。

> All React components must act like pure functions with respect to their props.

简单地来说就是`props`是不能被改变的，是只读的。

这里需要科普下`纯函数pure function`的概念，之后Redux也会遇到的。意思就是纯函数只是一个过程，期间不改变任何对象的值。因为JS的对象有个很奇怪的现象。如果你传入一个对象到这个方法中，并且改变了他某属性的值，那么传入的这个对象在函数外也会改变。`pure function`就是你的改动不能对函数作用域外的对象产生影响。所以每次我们在Component里面会遇到一个新的对象`state`，一般这个组件的数据我们会通过`state`在当前组件中进行变化处理。

> 划重点：因为JS的特性，所以`props`设置为只读，是为了不污染全局的作用域。这样很大程度上保证了`Component`的独立性。相当于一个`Component`就是一个小世界。
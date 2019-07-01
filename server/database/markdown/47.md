>今天划水的时候看到一个面试题，比较有意思，记录一下。

### 题目

```
function Foo() {
	getName = function() {
		console.log("1");
	};
	return this;
}
Foo.getName = function() {
	console.log("2");
};

Foo.prototype.getName = function() {
	console.log("3");
};

var getName = function() {
	console.log("4");
};
function getName() {
	console.log("5");
}
Foo.getName(); //  2
getName(); //  4
Foo().getName(); //  1
getName(); //  1
new Foo.getName(); //  2
new Foo().getName(); //  3
new new Foo().getName(); //  3

```

### 说明

**Foo.getName();**

执行函数的静态方法，输出 2

**getName();**

重点在于两种声明函数的方法的区别

解析器会先读取函数声明（ console.log("5")），并使其在执行任何代码之前可以访问，在任何地方调用都不会有问题

而函数表达式（ console.log("4")）则必须等到解析器执行到它所在的代码行才会真正被执行，提前调用会报错

这里输出 4


**Foo().getName();**
执行 Foo 方法导致 window 上的（没有作用域限制，默认是 window ） getName 函数被重新定义

返回的 this 的值取决于执行的位置，此时返回 window

相当于执行 window.getName()，输出1


**getName();**

即执行 window.getName()，输出1


**new Foo.getName();**

和执行属性有关

Foo.getName()先于new 关键字执行，相当于 new 对象的静态方法，输出 2


**new Foo().getName(); **

在 js 中，对象在调用一个方法时会首先在自身里寻找是否有该方法（对象方法），若没有，则去原型链（原型方法）上去寻找，依次层层递进

这里没有对象方法，执行原型方法，输出3


**new new Foo().getName();**

这个我自己也比较懵，网友的解释

拆成两步：

var foo = new Foo() => 实例化一个 Foo

new foo.getName() => 把原型链上的 getName 方法当作构造函数执行

执行下面这条语句就可以验证了

console.log(new new Foo().getName() instanceof Foo.prototype.getName)


### 相关博文

[js的方法和属性](/post/33)



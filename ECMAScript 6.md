# ECMAScript 6
# 1. Constants
ECMAScript 5 
```
Object.defineProperty(typeof global === "object" ? global : window, "PI", {
    value:        3.141593,
    enumerable:   true,
    writable:     false,
    configurable: false
})
PI > 3.0;
```

ECMAScript 6
```
const PI = 3.141593
PI > 3.0
```

Compatibility

IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9
:---:|:---:|:---:|:---:|:---:
 % | + | % | + | % 

# 2. Block-Scoped Variables
ECMAScript 5 
```
var i, x, y;
for (i = 0; i < a.length; i++) {
    x = a[i];
    …
}
for (i = 0; i < b.length; i++)
    y = b[i];
    …
}
var callbacks = [];
for (var i = 0; i <= 2; i++) {
    (function (i) {
        callbacks[i] = function() { return i * 2; };
    })(i);
}
callbacks[0]() === 0;
callbacks[1]() === 2;
callbacks[2]() === 4;

```

ECMAScript 6
```
for (let i = 0; i < a.length; i++) {
    let x = a[i]
    …
}
for (let i = 0; i < b.length; i++) {
    let y = b[i]
    …
}
let callbacks = []
for (let i = 0; i <= 2; i++) {
    callbacks[i] = function () { return i * 2 }
}
callbacks[0]() === 0
callbacks[1]() === 2
callbacks[2]() === 4
```
Compatibility

IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9
:---:|:---:|:---:|:---:|:---:
 % | + | % | + | - 
 
# 3. Block-Scoped Functions
ECMAScript 5 
```
(function () {
    var foo = function () { return 1; }
    foo() === 1;
    (function () {
        var foo = function () { return 2; }
        foo() === 2;
    })();
    foo() === 1;
})();
```

ECMAScript 6
```
{
    function foo () { return 1 }
    foo() === 1
    {
        function foo () { return 2 }
        foo() === 2
    }
    foo() === 1
}
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
| %  | +  | %  | +  | - |
# 4. Arrow Functions
# Expression Bodies
ECMAScript 5 
```
odds  = evens.map(function (v) { return v + 1; });
pairs = evens.map(function (v) { return { even: v, odd: v + 1 }; });
nums  = evens.map(function (v, i) { return v + i; });
```

ECMAScript 6
```
odds  = evens.map(v => v + 1)
pairs = evens.map(v => ({ even: v, odd: v + 1 }))
nums  = evens.map((v, i) => v + i)
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
| -  | +  | +  | +  | -  |
# Statement Bodies

ECMAScript 5 
```
nums.forEach(function (v) {
   if (v % 5 === 0)
       fives.push(v);
});
```

ECMAScript 6
```
nums.forEach(v => {
   if (v % 5 === 0)
       fives.push(v)
})
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
| -  | +  | +  |  + |  - |
# Lexical this
ECMAScript 5 
```
var self = this;
this.nums.forEach(function (v) {
    if (v % 5 === 0)
        self.fives.push(v);
});
```

ECMAScript 6
```
this.nums.forEach((v) => {
    if (v % 5 === 0)
        this.fives.push(v)
})
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
|  - | +  |  + | + | -  |
# 5. Extended Parameter Handling
# Default Parameter Values
ECMAScript 5 
```
function f (x, y, z) {
    if (y === undefined)
        y = 7;
    if (z === undefined)
        z = 42;
    return x + y + z;
};
f(1) === 50;
```

ECMAScript 6
```
function f (x, y = 7, z = 42) {
    return x + y + z
}
f(1) === 50
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
| -  |  + | %  | +  |  - |
# Rest Parameter
ECMAScript 5 
```
function f (x, y) {
    var a = Array.prototype.slice.call(arguments, 2);
    return (x + y) * a.length;
};
f(1, 2, "hello", true, 7) === 9;
```

ECMAScript 6
```
function f (x, y, ...a) {
    return (x + y) * a.length
}
f(1, 2, "hello", true, 7) === 9
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
|  - |  + | +  |  + |  - |
# Spread Operator
ECMAScript 5 
```
var params = [ "hello", true, 7 ];
var other = [ 1, 2 ].concat(params); // [ 1, 2, "hello", true, 7 ]
f.apply(undefined, [ 1, 2 ].concat(params)) === 9;

var str = "foo";
var chars = str.split(""); // [ "f", "o", "o" ]
```

ECMAScript 6
```
var params = [ "hello", true, 7 ]
var other = [ 1, 2, ...params ] // [ 1, 2, "hello", true, 7 ]
f(1, 2, ...params) === 9

var str = "foo"
var chars = [ ...str ] // [ "f", "o", "o" ]
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
| -  |  + |  + | +  |  % |
# 6. Iterators
# Iterator & For-Of Operator
Support "iterable" protocol to allow objects to customize their iteration behaviour. Additionally, support "iterator" protocol to produce sequence of values (either finite or infinite). Finally, provide convenient of operator to iterate over all values of an iterable object.

ECMAScript 5 
```
var fibonacci = {
    next: (function () {
        var pre = 0, cur = 1;
        return function () {
            tmp = pre;
            pre = cur;
            cur += tmp;
            return cur;
        };
    })()
};

var n;
for (;;) {
    n = fibonacci.next();
    if (n > 1000)
        break;
    console.log(n);
}
```

ECMAScript 6
```
let fibonacci = {
    [Symbol.iterator]() {
        let pre = 0, cur = 1
        return {
           next () {
               [ pre, cur ] = [ cur, pre + cur ]
               return { done: false, value: cur }
           }
        }
    }
}

for (let n of fibonacci) {
    if (n > 1000)
        break
    console.log(n)
}
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
| -  |%  | %  | +  | %  |
# 7. Classes
# Class Definition
ECMAScript 5 
```
var Shape = function (id, x, y) {
    this.id = id;
    this.move(x, y);
};
Shape.prototype.move = function (x, y) {
    this.x = x;
    this.y = y;
};
```

ECMAScript 6
```
class Shape {
    constructor (id, x, y) {
        this.id = id
        this.move(x, y)
    }
    move (x, y) {
        this.x = x
        this.y = y
    }
}
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
|  - |  + | +  | +  |  + |
# Class Inheritance
ECMAScript 5 
```
var Rectangle = function (id, x, y, width, height) {
    Shape.call(this, id, x, y);
    this.width  = width;
    this.height = height;
};
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
var Circle = function (id, x, y, radius) {
    Shape.call(this, id, x, y);
    this.radius = radius;
};
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
```

ECMAScript 6
```
class Rectangle extends Shape {
    constructor (id, x, y, width, height) {
        super(id, x, y)
        this.width  = width
        this.height = height
    }
}
class Circle extends Shape {
    constructor (id, x, y, radius) {
        super(id, x, y)
        this.radius = radius
    }
}
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
|  - | +  | +  |  + |  + |
# Static Members
ECMAScript 5 
```
var Rectangle = function (id, x, y, width, height) {
    …
};
Rectangle.defaultRectangle = function () {
    return new Rectangle("default", 0, 0, 100, 100);
};
var Circle = function (id, x, y, width, height) {
    …
};
Circle.defaultCircle = function () {
    return new Circle("default", 0, 0, 100);
};
var defRectangle = Rectangle.defaultRectangle();
var defCircle    = Circle.defaultCircle();
```

ECMAScript 6
```
class Rectangle extends Shape {
    …
    static defaultRectangle () {
        return new Rectangle("default", 0, 0, 100, 100)
    }
}
class Circle extends Shape {
    …
    static defaultCircle () {
        return new Circle("default", 0, 0, 100)
    }
}
var defRectangle = Rectangle.defaultRectangle()
var defCircle    = Circle.defaultCircle()
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
| -  |  + |  + |  + |  + |
# Getter/Setter
ECMAScript 5 
```
var Rectangle = function (width, height) {
    this._width  = width;
    this._height = height;
};
Rectangle.prototype = {
    set width  (width)  { this._width = width;               },
    get width  ()       { return this._width;                },
    set height (height) { this._height = height;             },
    get height ()       { return this._height;               },
    get area   ()       { return this._width * this._height; }
};
var r = new Rectangle(50, 20);
r.area === 1000;
```

ECMAScript 6
```
class Rectangle {
    constructor (width, height) {
        this._width  = width
        this._height = height
    }
    set width  (width)  { this._width = width               }
    get width  ()       { return this._width                }
    set height (height) { this._height = height             }
    get height ()       { return this._height               }
    get area   ()       { return this._width * this._height }
}
var r = new Rectangle(50, 20)
r.area === 1000
```
Compatibility
|IE 11|Microsoft Edge 14|Firefox 48|Google Chrome 52 / Opera 39|Safari 9|
|---|---|---|---|---|
| -  | +  | +  | +  |  + |

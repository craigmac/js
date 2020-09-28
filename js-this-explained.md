# Explanation of 'this' gotchas in JavaScript context

## Table of Contents

1. [Keys to Understand 'this'](#key-ideas)
1. [Function invocation 'this'](#function-invocation)
    1. [Issues](#function-this-issues)
    1. [Fixes to get desired 'this' context](#function-this-fixes)
1. [Method invocation 'this'](#method-invocation)
    1. [Issues](#method-this-issues)
    1. [Fixes to get desired 'this' context](#method-this-fixes)
1. [Constructor invocation 'this'](#constructor-invocation)
    1. [Issues](#constructor-this-issues)
    1. [Fixes to get desired 'this' context](#constructor-this-fixes)
1. [Indirect Invocation 'this'](#indirect-invocation)
    1. [Issues](#indirect-this-issues)
    1. [Fixes to get desired 'this' context](#indirect-this-fixes)
1. [Bound Function 'this'](#bound-invocation)
    1. [Issues](#bound-this-issues)
    1. [Fixes to get desired 'this' context](#bound-this-fixes)
1. [Arrow Function 'this'](#arrow-invocation)
    1. [Issues](#arrow-this-issues)
    1. [Fixes to get desired 'this' context](#arrow-this-fixes)

## Keys to Understanding 'this' <a name='key-ideas'></a>

Most important point:

- Understanding function invocation (i.e., call) in Js and how it works, and
  how it impacts the execution context, will help us understand the current
  'this' in code.

'this' defined:

- 'this' is the current execution context of a function when invoked/called.

js has 4 function invocation types:

1. function invocation e.g., `alert('hi')`
1. method invocation, `console.log('hi')`
1. constructor invocation, `new RegExp('hi')`
1. indirect invocation, `alert.call(undefined, 'hi')`

Each one defines call context in its own way, so 'this' behaves oddly in Js.

Terms:

1. Invocation - aka calling of a function. Executing the body of the function.
1. Context - of the invocation is the value of 'this' within fn body. For
   example, `map.set('key', 'value')` has the context `map`
1. Scope - what vars, objects, fns are accessible within function body.

## Function invocation 'this' <a name='function-invocation'></a>

1. Non-strict Mode:
**'this' is the global object in a function invocation**
2. Strict Mode:
**'this' is undefined in function invocation**

Meaning `window` in browser Js execution environment. NodeJs has a different
global object.

Examples, regular and IIFE (immediately-invoked fn expression):

```javascript
myFunction('hi');

const message = (function() { return 'hi' })();

function sum(a, b) {
  console.log(this === window) // true
  this.myNumber = 20 // creates global.myNumber property on global object
  return a + b
}
sum(15, 16) // function invocation, so 'this' is global object
console.log(window.myNumber) // is 20

// if you use 'this' outside a fn, it is interpreted as global object
console.log(this === window) // true, in browser, not in NodeJs

// In strict-mode (always use, most modern js libraries like React set this
// automatically so you don't need to unless working with vanilla Js).
function undefExample() {
  'use strict'
  console.log(this === undefined) // true because of strict mode
  console.log(this === window) // false now
}

```

### Issues <a name='function-this-issues'></a>

Common trap: thinking that 'this' is the same in an inner function as in
the outer function! The context of 'this' in the inner function **depends only
on its invocation type, not on the outer function's context!**. AKA, 'this'
is defined at **call site** not bound to context it was declared in originally.

Annoying tidbit: both non-strict and strict mode can be mixed in a single
file, so one fn declared local strict mode and another fn may be non-strict.

Examples:

```javascript
const numbers = {
  numberA: 5,
  numberB: 10,

  sum: function() {
    console.log(this === numbers) // true


    function calculate() {
      // if strict mode on, 'this' undefined otherwise 'window'
      // not 'numbers'
      console.log(this === numbers) // false! either undefined or 'global'
      return this.numberA + this.numberB
    }

    // fn invocation here, thus here 'this' is global object 'window',
    // or 'undefined' in strict mode (better). Even if outer fn 'sum'
    // here has context of 'numbers' object, it has no influence on
    // our fn invocation.
    return calculate() // call from numbers.sum() method but is fn invocation
  }
}

// calling returns 'NaN' or throws TypeError in strict mode (better).
// this is method invocation on a object, not a function invocation.
// The context in .sum() is 'numbers' object.
numbers.sum()

// To make 'this' have desired value, modify inner fn context with
// indirect invocation (.call() or .apply()) or create a bound fn
// using .bind()
```

### Fixes <a name='function-this-fixes'></a>

How do we get above to return desired result '15'?
the .calculate() fn we invoke must exectue with the same context as
the sum() method, i.e., have the context of 'numbers' object, in order
to access the A and B numbers using 'this'

**Solution 1: use indirect invocation** using .call() method to define the
context of 'this' during the life of the function.

```javascript
const numbers = {
  numberA: 5,
  numberB: 10,
  sum: function() {
    console.log(this === numbers) // true

    function calculate () {
      console.log(this === numbers) // true, now
      return this.numberA + this.numberB
    }

    // use .call() method to modify context of 'this' to current 'this',
    // aka 'sum' which has access to numberA & B
    return calculate.call(this)
  }
}

numbers.sum() // now returns desired 15
```

**Solution 2: use arrow function**. Starting with ES2015 you can insead
use the arrow/fat-arrow function syntax, which does not assert its own
context and instead uses the context where it was defined, aka an **arrow
function binds 'this' lexically'.**

The result? it just uses the context of the sum() method, aka 'this' will
be 'sum' which has access to 'numbers' object.

```javascript
const numbers = {
  numberA: 5,
  numberB: 10,
  sum: function() {
    console.log(this === numbers) // true

    const calculate = () => {
      console.log(this === numbers) // true, now
      return this.numberA + this.numberB
    }

    // using arrow fn above which captures 'this' of its parent, so we get
    // access to 'numbers' object through parent 'sum' context.
    return calculate()
  }
}

numbers.sum() // now returns desired 15
```

## Method invocation 'this' <a name='method-invocation'></a>

'this' in a method invocation:
**'this' is the object that owns the method in method invocation**

A method is a fn stored in the property of an object. A method is
invocation requires a property accessor form to call the function, e.g.,
`obj.myFunc()` or `obj['myFunc']()` using the alternate index syntax (because
objects in Js are just arrays.

Ex:

```javascript
const myObject = {
  thisIsMethod: function () {
    return 'hi'
  }
}

const message = myObject.thisIsMethod() // => 'hi'
```

Example using closure function (inner function captures the state of outer
function) and the value is maintained between calls to the inner function).
Result is a way to create 'private'-ish variables and data in Js.

```javascript
const calc = {
  num: 0,
  increment () {
    console.log(this === calc) // true
    this.num += 1 // one will be added to calc.num
    return this.num
  }
}

console.log(calc.increment()) // 1
console.log(calc.increment()) // 2
```

Another case: all js objects (all objects in js) inherit methods from its
parent `prototype`. When an inherited method is invoked on an object (the
instance), the context of the invocation (method invocation) **is still the
object itself**, meaning to say it is not the `prototype` parent/superclass.

```javascript
const myDog = Object.create({
  sayName() {
    console.log(this === myDog) // true
    return this.name
  }
})

// Object.create() creates a new object and sets its prototypes from
// the first argument, above a method called sayName

myDog.name = 'Milo'
// method invocation, 'this' value of 'myDog'
myDog.sayName() // => 'Milo'
```

ECMA2015 `class` syntax:
**in es6 class syntax, method invocation context ('this' value), is ALSO the
instance itsefl**: for example

```javascript
class Planet {
  constructor(name) {
    this.name = name
  }
  getName () {
    console.log(this === earth) // true! if instance name is 'earth'
    return this.name
  }
}

const earth = new Planet('Earth World')
earth.getName() // => 'Earth World'
```
### Issues <a name='-this-issues'></a>

1. **Separating method from its object**
Often done by extracted a var like `const alone = myObj.method`. When method is
called alone, detached from the original object (separated), the context of
`this` will not be the object on which it lives and was original defined.

What happens then? if the **method is called without an object, then function
invocation happens, and 'this' will be 'window' or 'undefined' in strict
mode**.

Example:

```javascript
function Pet(type, legs) {
  this.type = type
  this.legs = legs

  this.logInfo = function() {
    console.log(this === myCat) // false
    console.log(`The ${this.type} has ${this.legs} legs`)
  }
}

const myCat = new Pet('Cat', 4)
// Below returns:
// => 'The undefined has undefined legs' or TypeError in strict mode
// because the method is separated from its object when passed
// as a parameter (myCat.logInfo) we don't get the myCat context, we
// get the the function invocation global object
setTimeout(myCat.logInfo, 1000)
```

### Fixes <a name='-this-fixes'></a>

One way to fix the above is to use the .bind() method to bind a function
to an object and give the function body a 'this' equal to the object
bound to.

Previous example, fixed using .bind():

```javascript
function Pet(type, legs) {
  this.type = type
  this.legs = legs

  this.logInfo = function () {
    console.log(this === myCat) // true
    console.log(`The ${this.type} has ${this.legs} legs`)
  }
}

const myCat = new Pet('Cat', 4)

// bind the function to the object myCat for the function's context
// aka, it's 'this' value
const boundLogInfo = myCat.logInfo.bind(myCat)
// now this works!
setTimeout(boundLogInfo, 1000)
```

Another, ES6+ way is to simply use an arrow
function, which binds 'this' lexically, and is the simpler, cleaner solution. Use arrow fn where you can to avoid odd 'this' situations easily:

```javascript
function Pet(type, legs) {
  this.type = type
  this.legs = legs

  this.logInfo = () => {
    // arrow fn binds lexically, so 'this' is
    // taken from where defined,
    console.log(this === myCat) // true
    console.log(`The ${this.type} has ${this.legs} legs`)
  }
}

const myCat = new Pet('Cat', 4)
setTimeout(myCat.logInfo, 1000)
```

## Constructor invocation 'this' <a name='constructor-invocation'></a>

### Issues <a name='-this-issues'></a>

### Fixes <a name='-this-fixes'></a>

## Indirect Invocation 'this' <a name='indirect-invocation'></a>

### Issues <a name='-this-issues'></a>

### Fixes <a name='-this-fixes'></a>

## Bound Function 'this' <a name='bound-invocation'></a>

### Issues <a name='-this-issues'></a>

### Fixes <a name='-this-fixes'></a>

## Arrow Function 'this' <a name='arrow-invocation'></a>

### Issues <a name='-this-issues'></a>

### Fixes <a name='-this-fixes'></a>

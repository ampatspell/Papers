# #5 – Components

Previously we used plain html for rows. Let's improve on that by creating a `ui-block/rows` component with quite a few specialized `row` components.

* Less markup
* Parent-child component relationships
* Styleguide for entire application

``` hbs
// app/components/ui-route/playground/template.hbs
<div class="ui-block-rows">
  <div class="row">
    <div class="key">Person</div>
    <div class="value">{{person}}</div>
  </div>
  <div class="row">
    <div class="key">isCroc</div>
    <div class="value">{{if person.isCroc 'Yes, a croc!' 'Ahh, not a croc'}}</div>
  </div>
</div>
```

``` hbs
{{#ui-block/rows as |rows|}}
  {{rows.key-value 'Person' person}}
  {{rows.key-value 'isCroc' (if person.isCroc 'Yes, a croc!' 'Ahh, not a croc')}}
{{/ui-block/rows}}
```

## Create rows and row components

``` bash
$ ember g component ui-block/rows --pod
$ ember g component ui-block/rows/row --pod
```

## Update playground

So, if will have `rows` and `row` components, we could have a layout like this:

``` hbs
// app/components/ui-route/playground/template.hbs
{{#ui-block/rows as |rows|}}
  {{#rows.row}}
    <div class="key">Person</div>
    <div class="value">{{person}}</div>
  {{/rows.row}}
  {{#rows.row}}
    <div class="key">isCroc</div>
    <div class="value">{{if person.isCroc 'Yes, a croc!' 'Ahh, not a croc'}}</div>
  {{/rows.row}}
{{/ui-block/rows}}
```

To implement this nested component strategy we need to figure out few new things. Let’s start with actual implementation and then we will break it down step by step.

``` js
// app/components/ui-block/rows/component.js
import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'ui-block-rows' ]
});
```

``` js
// app/components/ui-block/rows/row/component.js
import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'row' ]
});
```

``` hbs
// app/components/ui-block/rows/row/template.hbs
{{yield}}
```

``` hbs
// app/components/ui-block/rows/template.hbs
{{yield (hash
  row=(component 'ui-block/rows/row')
)}}
```

* `yield`
* `hash` helper
* `component` helper

## Helpers

### Yield

Components can have a block (body). If block is provided, it can contain other components and/or html markup. The place where this markup is inserted is marked by `{{yield}}`. Also `{{yield}}` may return values.

``` js
// ui-component/component.js
export default Component.extend({
  classNames: [ 'ui-component' ]
});
```

``` hbs
// ui-component/template.hbs
<div class="icon"></div>
<div class="content">
  {{#if hasBlock}}
    {{yield "hello" "word"}}
  {{else}}
    Nothing
  {{/if}}
</div>
```

``` hbs
{{#ui-component as |message subject|}}
  {{message}} {{subject}}!
{{/ui-component}}
```

``` html
<div class="ui-component">
  <div class="icon"></div>
  <div class="content">
    hello world!
  </div>
</div>
```

### Hash

`hash` helper allows to create an object (key-value pairs) in template, so, if we want to refactor previous example and have a single returned value with both `message` and `subject`, we can do it like this:

``` hbs
// ui-component/template.hbs
{{yield
  (hash
    message='hello'
    subject='world'
  )
}}
```

``` hbs
{{#ui-component as |info|}}
  {{info.message}} {{info.subject}}!
{{/ui-component}}
```

### Component

`component` helper allows us to create components with names are resolved in runtime.

``` js
export default Component.extend({
  componentName: computed('model.type', function() {
    let type = this.get('model.type');
    // image, text, link, ...
    return `ui-block/post/${type}/edit`;
  })
});
```

``` hbs
{{component componentName model=model}}
```

Other usecase for component helper is to provide basically a component factory for parent component:

``` hbs
{{yield (component 'ui-block/rows/row')}}
```

``` hbs
{{ui-block/rows as |row|}}
  {{row}} // creates and adds a ui-block/rows/row component
  {{row}} // creates and adds another ui-block/rows/row component
{{/ui-block/rows}}
```

### Putting all those things together

Let's just scroll up.

## Create key-value row

But still, there is html in playground template which should be considered row internal implementation:

``` hbs
// app/components/ui-route/playground/template.hbs
{{#ui-block/rows as |rows|}}
  {{#rows.row}}
    <div class="key">Person</div>
    <div class="value">{{person}}</div>
  {{/rows.row}}
  ...
{{/ui-block/rows}}
```

To remedy that, let’s create a specific `key-value` row implementation which would nicely render this usecase.

``` bash
$ ember g component ui-block/rows/row/key-value --pod
```

This component will take `key` and `value` params and render those the same way we where rendering row content ourselves before.

``` hbs
// app/components/ui-route/playground/template.hbs
{{#ui-block/rows as |rows|}}
  {{rows.key-value key='Person' value=person}}
  {{rows.key-value
      key='isCroc'
      value=(if person.isCroc 'Yes, a croc!' 'Ahh, not a croc')
  }}
{{/ui-block/rows}}
```

Now this looks way more concise. But we can do better by using positional params which defines property names for each index.

``` hbs
// app/components/ui-route/playground/template.hbs
{{#ui-block/rows as |rows|}}
  {{rows.key-value 'Person' person}}
  {{rows.key-value 'isCroc' (if person.isCroc 'Yes, a croc!' 'Ahh, not a croc')}}
{{/ui-block/rows}}
```

Use positional params sparingly. We’ll see later on that this ‘put all in positional params’ are not the best option for input row we’ll create later on.

> Note to my past self: `{{row.key-value` `'``Person``'` `value=person}}` would be better option here

### Add key-value to yield hash

Next, we need to add `key-value` component to yield hash in rows template:

``` hbs
// app/components/ui-block/rows/template.hbs
{{yield (hash
  row=(component 'ui-block/rows/row')
  key-value=(component 'ui-block/rows/row/key-value')
)}}
```

### key-value component class

* component will extend base row to inherit class name
* positional params are set as a **class** property, so we’ll use `reopenClass`

``` js
// app/components/ui-block/rows/row/key-value/component.js
import Component from '../component';

export default Component.extend({
}).reopenClass({
  positionalParams: [ 'key', 'value' ]
});
```

``` hbs
// app/components/ui-block/rows/row/key-value/template.hbs
<div class="key">{{key}}</div>
<div class="value">{{value}}</div>
```

### link-to semantics

While we’re defining positional params here as an array or property names, it's also possible to have all positional params received as an array.

This is exacly what `{{link-to}}` component is using as it has multiple parameter options.

``` js
export default Component.extend({
}).reopenClass({
  positionalParams: 'params'
});
```

### key-value as a block

If block is given, don't render value.

``` hbs
// app/components/ui-route/playground/template.hbs
{{#ui-block/rows as |rows|}}
  {{#rows.key-value 'Full name'}}
    {{input value=person.fullName}}
  {{/rows.key-value}}
  {{#rows.key-value 'Name'}}
    {{input value=person.name}}
  {{/rows.key-value}}
  {{#rows.key-value 'Color'}}
    {{input value=person.color}}
  {{/rows.key-value}}
{{/ui-block/rows}}
```

``` hbs
// app/components/ui-block/rows/row/key-value/template.hbs
<div class="key">{{key}}</div>
{{#if hasBlock}}
  {{yield}}
{{else}}
  <div class="value">{{value}}</div>
{{/if}}
```

## Input row

``` bash
$ ember g component ui-block/rows/row/input --pod
```

``` hbs
// app/components/ui-block/rows/template.hbs
{{yield (hash
  row=(component 'ui-block/rows/row')
  key-value=(component 'ui-block/rows/row/key-value')
  input=(component 'ui-block/rows/row/input')
)}}
```

``` js
// app/components/ui-block/rows/row/input/component.js
import Component from '../component';

export default Component.extend({
}).reopenClass({
  positionalParams: [ 'key', 'value' ]
});
```

``` hbs
// app/components/ui-block/rows/row/input/template.hbs
<div class="key">{{key}}</div>
{{input value=value}}
```

``` hbs
// app/components/ui-route/playground/template.hbs
{{#ui-block/rows as |rows|}}
  {{rows.input 'Full name' person.fullName}}
  {{rows.input 'Name' person.name}}
  {{rows.input 'Color' person.color}}
{{/ui-block/rows}}
```

## Button

``` bash
$ ember g component ui-block/rows/row/button --pod
```

``` hbs
// app/components/ui-block/rows/template.hbs
{{yield (hash
  row=(component 'ui-block/rows/row')
  key-value=(component 'ui-block/rows/row/key-value')
  input=(component 'ui-block/rows/row/input')
  button=(component 'ui-block/rows/row/button')
)}}
```

``` hbs
// app/components/ui-route/playground/template.hbs
{{#ui-block/rows as |rows|}}
  {{rows.button 'Save'}}
{{/ui-block/rows}}
```

``` js
// app/components/ui-block/rows/row/button/component.js
import Component from '../component';

export default Component.extend({
  tagName: 'button',
  classNames: [ 'button' ],
  attributeBindings: [ 'disabled' ],

}).reopenClass({
  positionalParams: [ 'title' ]
});
```

``` hbs
// app/components/ui-block/rows/row/button/template.hbs
{{title}}
```

Concatenated properties for **Component**:

* `classNames`
* `classNameBindings`
* `attributeBindings`

Merged properties for **Component**:

* `actions`

Add a click event handler for a button.

``` js
// app/components/ui-block/rows/row/button/component.js
import Component from '../component';

export default Component.extend({
  tagName: 'button',
  classNames: [ 'button' ],
  attributeBindings: [ 'disabled' ],

  click() {
    console.log('click');
  }

}).reopenClass({
  positionalParams: [ 'title' ]
});
```

We need to notify parent component about user interaction.

This is done in two steps:

* Parent component **provides an action**
* Component **invokes provided action**

Component can make sure that action is provided and optionally do something differently when there is or is not an action provided. In this example, we could make the button disabled if there is no action provided.


* Action is a closure function
* Action is **created** by using `action` template helper
* Action is implemented in component’s `actions` object (merged)

``` js
// app/components/ui-route/playground/component.js
import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'ui-route-playground' ],

  actions: {
    save(person) {
      console.log(...arguments);
      console.log(person.getProperties('name', 'color'));
    }
  }
});
```

``` hbs
{{log (action 'save' person)}}
```

* bound to the receiver (component)
* can pass around and invoke like any regular function
* caller can provide arguments on invocation and receive return value

``` js
// console
// store as global variable
temp1('be nice')
```

![](https://d2mxuefqeaa7sj.cloudfront.net/s_7B5D8F285C17B6DDD6867EF7B138EFC38E90A924B3A9616B7DD0BC40CABBE30E_1520950899146_Screen+Shot+2018-03-13+at+16.21.27.png)

``` hbs
// app/components/ui-route/playground/template.hbs
{{#ui-block/rows as |rows|}}
  {{rows.button 'Save' action=(action 'save' person)}}
{{/ui-block/rows}}
```

``` js
// app/components/ui-block/rows/row/button/component.js
import Component from '../component';

export default Component.extend({
  tagName: 'button',
  classNames: [ 'button' ],
  attributeBindings: [ 'disabled' ],

  click(e) {
    let action = this.get('action');
    if(!action) {
      return;
    }
    action();
  }

}).reopenClass({
  positionalParams: [ 'title' ]
});
```

> sidenote

``` hbs
// app/components/ui-route/playground/template.hbs

// you can do this
// don't do this
{{#ui-block/rows as |rows|}}
  {{rows.button 'Save' click=(action 'save' person)}}
{{/ui-block/rows}}
```

## Two more ways to handle events

``` hbs
// app/components/ui-route/playground/template.hbs
{{#ui-block/rows as |rows|}}
  <button class="row button" onclick={{action "save" person}}>onClick</button>
  <button class="row button" {{action "save" person}}>action</button>
{{/ui-block/rows}}
```

* `on={{action}}` actions are invoked before all `{{action}}` actions

## Parent-child relationship between components

``` hbs
// app/components/ui-block/rows/template.hbs
{{yield (hash
  component=this
  row=(component 'ui-block/rows/row' rows=this)
  ...
)}}
```

``` hbs
{{#ui-block/rows as |rows|}}
  {{rows.row}} // receives rows
{{/ui-block/rows}}
```

### The same, manually

``` hbs
{{#ui-block/rows as |rows|}}
  {{ui-block/rows/row rows=rows.component}}
{{/ui-block/rows}}
```

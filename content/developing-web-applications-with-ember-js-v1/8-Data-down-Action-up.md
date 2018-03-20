# #8 – Data down, Action up

In previous examples, we used `{{input}}` helper which modifies value “in-place”. This makes it harder to see where exactly data is changed in complex component trees.

Let's simplify. Let's make input component to show current value and notify on value changes. But instead of allowing input to modify the person properties directly, move this logic to parent component which ‘owns’ the model.

To do that, we will use DOM `<input/>` element with `onInput` event handler attached.

## <input/>

``` hbs
// app/components/ui-block/rows/row/input/template.hbs
<div class="key">{{key}}</div>
<input type="text" value={{value}} oninput={{action "update"}}/>
```

``` js
// app/components/ui-block/rows/row/input/component.js
import Component from '../component';
export default Component.extend({

  actions: {
    update(e) {
      let value = e.target.value;
      let update = this.get('update');
      update && update(value);
    }
  }

}).reopenClass({
  positionalParams: [ 'key', 'value', 'update' ]
});
```

## Using input with update action

``` hbs
// app/components/ui-route/playground/template.hbs
{{rows.input 'Name' value=person.name update=(action 'updateProperty' person 'name')}}
```

``` js
// app/components/ui-route/playground/component.js
import Component from '@ember/component';

export default Component.extend({
  classNames: [ 'ui-route-playground' ],

  actions: {
    updateProperty(person, key, value) {
      person.set(key, value);
    },
    ...
  }
});
```

Now `person.name` is updated by playground component which is able to:

* modify the value before setting it to the person
* can reject the update
* can do anything related to the update (schedule save for example)

``` hbs
// app/components/ui-route/playground/template.hbs
{{rows.input 'Color' person.color (action (mut person.color))}}
```

But let’s have an actions for updating name and color:

``` js
// app/components/ui-route/playground/component.js
import Component from '@ember/component';
import { capitalize } from '@ember/string';

export default Component.extend({
  classNames: [ 'ui-route-playground' ],

  actions: {
    updateName(person, value) {
      person.set('name', capitalize(value));
    },
    updateColor(person, value) {
      person.set('color', value.toLowerCase());
    },
  }
});
```

``` hbs
// app/components/ui-route/playground/template.hbs
{{#ui-block/rows as |rows|}}
  {{rows.input 'Full name' person.fullName (action (mut person.fullName))}}
  {{rows.input 'Name' person.name (action 'updateName' person)}}
  {{rows.input 'Color' person.color (action 'updateColor' person)}}
{{/ui-block/rows}}
```

## Recap

* Input receives data and sends action up to the parent component
* Parent component is responsible for property update, rejection or to forward action further up

## Recommendations

* Don't use `{{input}}` and others
* Have a `value` and `update` properties for all primitives (input, checkbox, …)
* Provide a default `mut` behavior as a separate component if needed:

``` hbs
{{ui-block/input/mut model=person key='name' update=(action 'didUpdatePersonName'}}
```

``` hbs
// ui-block/input/mut/template.hbs
{{ui-block/input value=(get person key) update=(action 'update')}}
```

``` js
// ui-block/input/mut/component.js
update(value) {
  let { model, key, update } = this.getProperties('model', 'key', 'update');
  model.set(key, value);
  if(update) {
    update(value);
  }
}
```

> one-way controls: https://github.com/DockYard/ember-one-way-controls

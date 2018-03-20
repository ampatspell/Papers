# #7 – Template Helpers

Template helpers are useful for tasks like transforming values for display.

To transform `name` and `color` into `fullName` we have three options:

* computed property (allows us to set the value)
* template helper (generic, reusable transform)
* component (layout)

But let's say we want to join first and last names in the template.

And we have this javascript function which replaces all occurences of `${key}` in the string with value from passed object:

``` js
// app/lib/format.js
import { get } from '@ember/object';

// format('hello, ${name}', { name: 'zeeba' }) => 'hello, zeeba'
export default (string, object={}) => {
  return string.replace(/\${([a-z]+)}/g, (all, key) => {
    let value = get(object, key);
    if(typeof value !== 'undefined') {
      return value;
    }
    return key;
  });
}
```

``` js
format('Hello, ${name}!', { name: 'zeeba' }) // => 'Hello, zeeba!'
format('Hello, ${name}!', {}) // => 'Hello, name!'
```

We can make this available for templates by creating a template helper.

## Generate “format” helper

``` bash
$ ember g helper format
```

``` js
// app/helpers/format.js
import { helper } from '@ember/component/helper';

// (format 'Hello, ${name}!' name='Zeeba')
export function format(params, hash) {
  let [ string ] = params;
  console.log(string, hash);
}

export default helper(format);
```

and add it to the playground template

``` hbs
// app/components/ui-route/playground/template.hbs
{{rows.key-value
  'Full Name (using format helper)'
  (format '${color} ${name}' color=person.colorOrColorless name=person.nameOrUnnamed)
}}
```

``` js
// console
"${color} ${name}" EmptyObject {color: "green", name: "croc"}
```

## Integrate format util into helper

``` js
// app/helpers/format.js
import { helper } from '@ember/component/helper';
import fmt from '../lib/format';

export function format(params, hash) {
  let [ string ] = params;
  return fmt(string, hash);
}

export default helper(format);
```

## Two forms of helper

* Function–based using `helper(fn)`
* Class–based using `Helper.extend({ … })`

## Class–based helper

Useful for:

* observing service properties and recompute on change
* creating and destroying created objects when template is destroyed

``` js
// app/helpers/format.js
import Helper from '@ember/component/helper';
import fmt from '../lib/format';

export default Helper.extend({

  compute(params, hash) {
    let [ string ] = params;
    return fmt(string, hash);
  }

});
```

### Fictional example localisation helper

* `observer`

``` js
// app/helpers/l.js
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { observer } from '@ember/object';

export default Helper.extend({

  localisation: service(),
  locale: readOnly('localisation.locale'),

  compute(params, hash) {
    let [ string ] = params;
    return this.get('localisation').format(string, hash);
  },

  localeDidChange: observer('locale', function() {
    this.recompute();
  })

});
```

## Use helper value as a parameter

``` hbs
// direct
<div class="name">{{format ‘hello ${name}’ name=’Zeeba’}}</div>
```

``` hbs
// Pass to a component as a parameter
{{ui-route/playground title=(format ‘hello ${name}’ name=’Zeeba’)}}
```

``` hbs
{{ui-route/playground
    title=(format
        (localize ‘You have ${count} ${messages}’)
        count=message.count
        messages=(pluralize message.count 'message' 'messages)
    )
}}

// You have 5 messages
// You have 1 message
```

> Localise & Pluralize: https://github.com/jamesarosen/ember-i18n

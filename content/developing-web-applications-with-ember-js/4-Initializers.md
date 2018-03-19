# #4 – Initializers

Previously we used window reference in random places to make something globally available. There is better way which involves Ember’s instance-initializers.

* initializer
* instance-initializer
* application
* application instance
* fastboot

``` js
// app/lib/set-global.js
import env from '../../config/environment';

const isDevelopment = env.environment === 'development';

export default hash => {
  if(!isDevelopment) {
    return;
  }
  for(let key in hash) {
    let value = hash[key];
    // eslint-disable-next-line no-console
    console.log(`window.${key} = ${value}`);
    window[key] = value;
  }
};
```

``` js
// app/instance-initializers/quotes-dev.js
import setGlobal from '../lib/set-global';

export default {
  name: 'quotes:dev',
  initialize(app) {
    let env = app.lookup('config:environment');
    console.log(env);
    if(env.environment !== 'development') {
      return;
    }

    let storage = app.lookup('service:storage');
    setGlobal({ storage });
  }
}
```

![](https://d2mxuefqeaa7sj.cloudfront.net/s_EC486933B01607EF76E2004367E0E49393D44CD28BF420C7138345BC074E1915_1521031513278_Screen+Shot+2018-03-14+at+14.40.37.png)



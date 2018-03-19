import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  papers: service(),

  model() {
    return this.get('papers').load();
  }

});

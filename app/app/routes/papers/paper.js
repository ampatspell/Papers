import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  papers: service(),

  model(params) {
    let identifier = params.identifier;
    return this.get('papers').paper(identifier);
  },

  serialize(paper) {
    return {
      identifier: paper.get('identifier')
    };
  }

});

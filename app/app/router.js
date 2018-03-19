import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('papers', function() {
    this.route('paper', { path: '/:identifier' });
  });
});

export default Router;

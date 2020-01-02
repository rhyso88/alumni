import Vue from "nativescript-vue";
import routes from "./routes";
import BackendService from "./services/backend-service";

// Uncommment the following to see NativeScript-Vue output logs
//Vue.config.silent = false;

const backendService = new BackendService();
Vue.prototype.$backendService = backendService;

// Import fontawesome icons

import {TNSFontIcon, fonticon} from 'nativescript-fonticon';

TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  'fa': './assets/css/all.css',
  'far': './assets/css/all.css',
  'fas': './assets/css/all.css',
  'fab': './assets/css/all.css',
};
TNSFontIcon.loadCss();

Vue.filter('fonticon', fonticon);


new Vue({
  render: h => h("frame", [h(backendService.isLoggedIn() ? routes.home : routes.login)])
}).$start();

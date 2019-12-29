import Vue from "nativescript-vue";
import routes from "./routes";
import BackendService from "./services/backend-service";

import * as Kinvey from "kinvey-nativescript-sdk";

/*
Kinvey.init({
    appKey: "kid_S1Gok7ARr",
    appSecret: "430e2c4f39c240e6970bd5683bf9cc09"
});


Kinvey.ping()
    .then(function(response) {
        console.log(
            'Kinvey Ping Success. Kinvey Service is alive, version: '
            + response.version + ', response: ' + response.kinvey);
    })
    .catch(function(error) {
        console.log('Kinvey Ping Failed. Response: ' + error.description);
    });

    */

// Uncommment the following to see NativeScript-Vue output logs
//Vue.config.silent = false;

const backendService = new BackendService();
Vue.prototype.$backendService = backendService;

new Vue({
  render: h => h("frame", [h(backendService.isLoggedIn() ? routes.home : routes.login)])
}).$start();

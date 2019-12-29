<template>
  <Page>
    <ActionBar title="Home1 APP"></ActionBar>

    <StackLayout>
      <Label class="body m-20" :text="message" textWrap="true"></Label>
      <Label class="body m-20" :text="message2" textWrap="true"></Label>
      <Label class="body m-20" :text="message3" textWrap="true"></Label>
      <StackLayout orientation="vertical">
        <ListView for="data in localdata">
          <v-template>
            <Label :text="data.name" verticalAlignment="center" />
          </v-template>
        </ListView>
      </StackLayout>
      <Button class="btn btn-primary" text="Log out" @tap="logout"></Button>
    </StackLayout>
  </Page>
</template>

<script>
// import required

import Login from "./Login";
import * as Kinvey from "kinvey-nativescript-sdk";

// rest of Vue code

export default {
  data() {
    return {
      message: "empty starting apple",
      message2: "empty starting text",
      message3: "empty starting text",
      localdata: []
    };
  },
  methods: {
    logout() {
      this.$backendService.logout();
      this.$navigateTo(Login, {
        clearHistory: true
      });
    }
  },
  created() {
    // create a variable to hold 'this' so I can used inside of other function scopes
    //this.message2 = "Rhys changed on entry";

    var vm = this;

    // initialise and then check Kinvey connection using promises to wait for connection

    Kinvey.init({
      appKey: "kid_S1Gok7ARr",
      appSecret: "430e2c4f39c240e6970bd5683bf9cc09"
    });

    Kinvey.ping()
      .then(function(response) {
        console.log(
          "&&&&&&&& Kinvey linked within Home.vue &&&&&&&&" +
            response.version +
            ", response: " +
            response.kinvey
        );
      })
      .then(function(pass) {
        console.log(
          "Kinvey ping connection received - now get data collection"
        );

        // check active user once data received from Kinvey (add if statement later)

        const activeUser = Kinvey.User.getActiveUser();
        if (activeUser == null) {
          console.log("active user is null inside Home.vue");
        } else {
          console.log("active user is true inside Home.vue");
        }

        // collect datastore from kinvey

        // first establish dataStore from Kinvey, with 'Auto' data type

        const dataStore = Kinvey.DataStore.collection(
          "test",
          Kinvey.DataStoreType.Auto
        );

        //console.log("Home.vue - datastore returned:" + dataStore);

        // now store the dataStore locally in an array

        dataStore.find().then(
          (items) => {
            console.log(items);
            //vm.message = "changed inside datastore twice";
            items.forEach(item => {
              vm.localdata.push(item);
            });
          },
          (error) => {
            console.log("stream error found:" + error);
          }
        );
      })
      .catch(function(error) {
        console.log(
          "&&&&&&&& Kinvey NOT linked within Home.vue &&&&&&&&. Response: " +
            error.description
        );
      });
  }
};
</script>

<style>
</style>

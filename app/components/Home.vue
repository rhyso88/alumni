<template>
  <Page>
    <ActionBar title="Home1 APP"></ActionBar>
    <ScrollView orientation="vertical">
      <StackLayout>
        <Label class="body m-20" :text="message" textWrap="true"></Label>
        <Button class="btn btn-primary" text="Add Data" @tap="saveData"></Button>
        <Button class="btn btn-primary" text="Update Data" @tap="getData"></Button>
        <Label class="body m-20" :text="message3" textWrap="true"></Label>
        <StackLayout orientation="vertical">
          <ListView for="data in localdata">
            <v-template>
              <Label :text="data.name" verticalAlignment="center" />
            </v-template>
          </ListView>
        </StackLayout>
        <Label class="body m-20" :text="message4" textWrap="true"></Label>
        <StackLayout orientation="vertical">
          <ListView for="data in recentdata">
            <v-template>
              <Label :text="data.name" verticalAlignment="center" />
            </v-template>
          </ListView>
        </StackLayout>
        <Button class="btn btn-primary" text="Log out" @tap="logout"></Button>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
// import required

import Login from "./Login";
import * as Kinvey from "kinvey-nativescript-sdk";
var dialogs = require("tns-core-modules/ui/dialogs");

// rest of Vue code

export default {
  data() {
    return {
      message: "test message location",
      message3: "Data from Kinvey:",
      message4: "Updated data post save:",
      localdata: [],
      recentdata: []
    };
  },
  methods: {
    logout() {
      this.$backendService.logout();
      this.$navigateTo(Login, {
        clearHistory: true
      });
    },
    saveData() {

      // create a variable to hold 'this' so I can used inside of other function scopes

      var vm = this;

      // establish Kinvey connection dataStore

      const dataStore = Kinvey.DataStore.collection(
        "members",
        Kinvey.DataStoreType.Auto
      );

      // save object below on button click

      const entSave = { name: "Green Goblin" };

      const promise = dataStore
        .save(entSave)
        .then(function(entity) {
          vm.message = "now inside promised update data after save update";
          vm.getData();
        })
        .catch(function(error) {
          // ...
        });
      
      // confirm if user wants to add data to Kinvey

      dialogs
        .confirm({
          title: "Save Data",
          message: "Do you want to add this data to the server?",
          okButtonText: "Yes",
          cancelButtonText: "No"
        })
        .then(function(result) {
          // result argument is boolean
          console.log("Dialog result completed: " + result);
        });
    },
    getData() {

      // create a variable to hold 'this' so I can used inside of other function scopes

      var vm = this;

      // establish a Kinvey connection dataStore

      const dataStore = Kinvey.DataStore.collection(
        "members",
        Kinvey.DataStoreType.Auto
      );

      // get dataStore data, and store it locally in a Vue data array

        dataStore.find().then(
          items => {
            //console.log(items);
            //vm.message = "2nd cahnge inside getData method";
            vm.localdata = [];
            items.forEach(item => {
              vm.localdata.push(item);
            });
          },
          error => {
            console.log("error in getData method:" + error);
          }
        );
        
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
          "members",
          Kinvey.DataStoreType.Auto
        );

        //console.log("Home.vue - datastore returned:" + dataStore);

        // now store the dataStore locally in an array

        dataStore.find().then(
          items => {
            //console.log(items);
            //vm.message = "changed inside datastore twice";
            items.forEach(item => {
              vm.localdata.push(item);
            });
          },
          error => {
            console.log("stream error found:" + error);
          }
        );
      })

      /* This was the first way I used to save data to Kinvey

      // ability to save data/entities to server
      // 'pass' is undefined as I am not carrying anything over from previous then

      .then(function(pass) {
        //set dataStore within this promise

        const dataStore = Kinvey.DataStore.collection(
          "members",
          Kinvey.DataStoreType.Auto
        );

        //entity to upload to Kinvey dataStore

        console.log("inside function to save entities");
        //console.log("using this to save to:" + dataStore);

        const entSave = { name: "Hermione Granger" };

        const promise = dataStore
          .save(entSave)
          .then(function(passedBack) {
            //do nothing atm, will call update list soon
          })
          .catch(function(error) {
            // ...
          });
        //await dataStore.save(savEnt);
      })

      */

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

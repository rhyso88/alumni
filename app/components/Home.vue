<template>
  <Page>
    <ActionBar title="Home1 APP"></ActionBar>
    <ScrollView orientation="vertical">
      <StackLayout>
        <Label class="body m-20" :text="message" textWrap="true"></Label>
        <Button class="btn btn-primary" text="Add Data" @tap="addData"></Button>
        <Button class="btn btn-primary" text="Update Data" @tap="getData"></Button>
        <!--<Button class="btn btn-primary" text="Delete Data" @tap="deleteData"></Button>-->
        <Label class="body m-20" :text="message3" textWrap="true"></Label>
        <StackLayout orientation="vertical">
          <ListView for="item in localdata" @itemTap="onItemTap">
            <v-template>
              <StackLayout orientation="horizontal">
                  <Label :text="item.name" verticalAlignment="center"/>
              </StackLayout>
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
      message3: "Data from Kinvey:",
      localdata: [],
      todelete:"_id of object will go here"
    };
  },
  methods: {

    logout() {
      this.$backendService.logout();
      this.$navigateTo(Login, {
        clearHistory: true
      });
    },

    onItemTap: function(event) {
      console.log("ID of object tapped: " + this.$data.localdata[event.index]._id);
      console.log("Object name tapped: " + this.$data.localdata[event.index].name);
      this.$data.todelete = this.$data.localdata[event.index]._id;
      this.deleteData();
    },

    /* Long press ability - need to work out later for delete ability

    onLongPress(args) {
    console.log("long press initiated");
    console.log(`Object that triggered the event: ${args.object}`);
    console.log(`Event name: ${args.eventName}`);
    },

    */

    addData() {
      // create a variable to hold 'this' so I can used inside of other function scopes

      var vm = this;

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

          //console.log("Do you want to save data - result returned: " + result);

          // if client confirms wants to add data, connect to Kinvey and addData

          if (result) {
            console.log("You have detected true, and will add this data");

            // establish Kinvey connection dataStore

            const dataStore = Kinvey.DataStore.collection(
              "members",
              Kinvey.DataStoreType.Auto
            );

            // add object below on button click

            const entAdd = { name: "Green Goblin" };

            const promise = dataStore
              .save(entAdd)
              .then(function(entity) {
                vm.message =
                  "now inside promised update data after save update";
                vm.getData();
              })
              .catch(function(error) {
                // ...
              });
          }
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
    },
    deleteData() {
      // create a variable to hold 'this' so I can used inside of other function scopes

      var vm = this;

      // confirm want to delete data, then remove it from Kinvey server

      //console.log("inside delete funciton");

      dialogs
        .confirm({
          title: "Delete Data",
          message: "Do you want to delete this entry from the server?",
          okButtonText: "Yes",
          cancelButtonText: "No"
        })
        .then(function(result) {
          // result argument is boolean
          //console.log("Client delete data result returned true or false: " + result);

          // establish a Kinvey connection dataStore
          const dataStore = Kinvey.DataStore.collection(
            "members",
            Kinvey.DataStoreType.Auto
          );

          //object for id/data that we want to remove from Kinvey server

          //console.log("item to delete using tap method" + vm.todelete);

          const remID = { _id: vm.todelete };

          //remove object with _id from Kinvey server

          var promise = dataStore
            .removeById(remID._id)
            .then(function(result) {
              vm.getData();
            })
            .catch(function(error) {
              // ...
            });
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
          "members",
          Kinvey.DataStoreType.Auto
        );

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

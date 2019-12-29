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
//Import required
import Login from "./Login";
import * as Kinvey from "kinvey-nativescript-sdk";

//import datasync2 from "../services/data-sync2";

//rest of Vue code

export default {
  data() {
    return {
      message: "Yocation functionality.",
      message2: "test2",
      message3: "final",
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
    //Create an variable to hold 'this' so I can used inside of other function scopes

    this.message2 = "Rhys changed on entry"; // Just a check to see what 'this' is
    var vm = this;

    //initialise and then check Kinvey connection using promises to wait for connection

    Kinvey.init({
      appKey: "kid_S1Gok7ARr",
      appSecret: "430e2c4f39c240e6970bd5683bf9cc09"
    });

    Kinvey.ping()
      .then(function(response) {
        console.log(
          "&&&&&&&& Kinvey linked within SFC Home &&&&&&&&" +
            response.version +
            ", response: " +
            response.kinvey
        );
      })
      .then(function(pass) {
        console.log("after Kinvey received");

        // check active user once data received from Kinvey

        const activeUser = Kinvey.User.getActiveUser();
        if (activeUser == null) {
          console.log("active user is null");
        } else {
          console.log("active user is true inside SFC");
        }

        // collect datastore from kinvey

        const dataStore = Kinvey.DataStore.collection("names");
        const stream = dataStore.find();
        //console.log("SFC - datastore returned" + dataStore);
        //console.log("SFC - stream returned" + stream);

        //var localdata = [];

        // loop through datastore array and store data locally

        stream.subscribe(
          employees => {
            employees.forEach(element => {
              vm.localdata.push(element);
              vm.message = "Im acessing Vue data inside the loop";
            });
          },
          error => {
            console.log("error found in datasync2" + error);
          },
          () => {
            console.log("adding values to local data store");
          }
        );
      })
      .catch(function(error) {
        console.log(
          "&&&&&&&& Kinvey NOT linked within SFC Home &&&&&&&&. Response: " +
            error.description
        );
      });
  }
};
</script>

<style>
</style>

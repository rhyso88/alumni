<template>
  <Page actionBarHidden="true">
    <GridLayout rows="70, *, auto" columns="*, *, *">
      <Image
        src="~/assets/images/BD_reg_white_bg.png"
        class="topLogo"
        stretch="aspectFit"
        row="0"
        col="0"
        colSpan="1"
      />
      <Button row="0" col="1" class="btn btn-primary" text="actOn/Off" @tap="toggleAct"></Button>
      <Button row="0" col="2" class="btn btn-primary" text="Logout" @tap="logout"></Button>

      <!-- main components all on top of each other, since only 1 will be visible at any given time -->

      <ActivityIndicator row="1" col="0" colSpan="3" :busy="activity" v-show="activity"/>

      <ScrollView
        orientation="vertical"
        row="1"
        col="0"
        colSpan="3"
        v-show="'AddressBook' === currentComponent & !activity"
      >
        <ListView for="item in localdata" height="800">
          <v-template>
            <GridLayout rows="*" columns="auto,*,auto,auto,auto" @tap="showDetailPageModally(item)">
              <Image row="0" col="0" :src="item.src" class="thumb img-circle" />
              <Label row="0" col="1" :text="'Name: '+item.name" />
              <Label
                row="0"
                col="2"
                :class="iconColWhite(item.eng_sci)"
                :text="'fa-tools' | fonticon"
              />
              <Label
                row="0"
                col="3"
                :class="iconColWhite(item.medical)"
                :text="'fa-stethoscope' | fonticon"
              />
              <Label
                row="0"
                col="4"
                :class="iconColWhite(item.corporate)"
                :text="'fa-briefcase' | fonticon"
              />
            </GridLayout>
          </v-template>
        </ListView>
      </ScrollView>

      <ScrollView
        orientation="vertical"
        row="1"
        col="0"
        colSpan="3"
        v-show="'Noticeboard' === currentComponent"
      >
        <StackLayout orientation="vertical">
          <Label text="Noticeboard" />
          <Button class="btn btn-primary" text="Log out" @tap="logout"></Button>
          <Button class="btn btn-primary" text="Add Data" @tap="addData"></Button>
          <Button class="btn btn-primary" text="Get Data" @tap="getData"></Button>
          <Button class="btn btn-primary" text="Update Data" @tap="updateData"></Button>
        </StackLayout>
      </ScrollView>

      <ScrollView
        orientation="vertical"
        row="1"
        col="0"
        colSpan="3"
        v-show="'Alerts' === currentComponent"
      >
        <StackLayout orientation="vertical">
          <Label text="Alerts" />
          <Button class="btn btn-primary" text="Log out" @tap="logout"></Button>
        </StackLayout>
      </ScrollView>

      <!-- Bottom navigation -->
      <Button
        :class="navigationButtonClasses('AddressBook')"
        @tap="currentComponent = 'AddressBook'"
        :text="'fa-address-card' | fonticon"
        row="2"
        col="0"
      />
      <Button
        :class="navigationButtonClasses('Noticeboard')"
        @tap="currentComponent = 'Noticeboard'"
        :text="'fa-newspaper' | fonticon"
        row="2"
        col="1"
      />
      <Button
        :class="navigationButtonClasses('Alerts')"
        @tap="currentComponent = 'Alerts'"
        :text="'fa-bell' | fonticon"
        row="2"
        col="2"
      />
    </GridLayout>
  </Page>
</template>

<script>
// import required

import Login from "./Login";
import * as Kinvey from "kinvey-nativescript-sdk";
var dialogs = require("tns-core-modules/ui/dialogs");

// Define modal view template

const alumDetail = {
  props: ["name", "occupation", "src", "eng_sci", "medical", "corporate"],
  template: `
  <Page>
    <DockLayout>
      <StackLayout dock="top" height="90%" width="100%" style>
        <ScrollView>
          <StackLayout style="font-size:18;">
            <StackLayout alignItems="center">
                <Image :src="src" stretch="aspectFill" class="profilePic"></Image>
                <Label :text="name" color="#000" fontSize="19" fontWeight="bold" textAlignment="center"/>
                <StackLayout class="aboutContainer">
                        <StackLayout>
                            <Label :text="occupation" style="font-size:16;color:#000;margin-left:9;margin-top:1;"/>
                            <Label text="Qualifications" style="font-size:16;color:#000;margin-left:9;margin-top:1;"/>
                            <Label text="Contact" style="font-size:16;color:#000;margin-left:9;margin-top:1;"/>
                        </StackLayout>
                </StackLayout>
            </StackLayout>
              <StackLayout orientation="horizontal" class="followersContainer">
                <StackLayout width="33%">
                    <Label class="fas followersTxtValue" :text="'fa-tools' | fonticon" v-show="eng_sci"/>
                    <Label class="followersTxt" text="Engineering/Science" v-show="eng_sci"/>
                </StackLayout>
                <StackLayout width="33%">
                    <Label class="fas followersTxtValue" :text="'fa-stethoscope' | fonticon" v-show="medical"/>
                    <Label class="followersTxt" text="Medicine" v-show="medical"/>
                </StackLayout>
                <StackLayout width="33%">
                    <Label class="fas followersTxtValue" :text="'fa-briefcase' | fonticon" v-show="corporate"/>
                    <Label class="followersTxt" text="Corporate" v-show="corporate"/>
                </StackLayout>
              </StackLayout>
            </StackLayout>
        </ScrollView>
      </StackLayout>
    </DockLayout>
  </Page>
	    `
};

// rest of Vue code

export default {
  data() {
    return {
      toSearch: false,
      searchQuery: "defaultSearch",
      currentComponent: "AddressBook",
      componentsArray: ["AddressBook", "Noticeboard", "Alerts"],
      localdata: [],
      todelete: "_id of object you want to delete will go here",
      activity: false
    };
  },
  methods: {
    logout() {
      this.$backendService.logout();
      this.$navigateTo(Login, {
        clearHistory: true
      });
    },
    toggleAct() {
      this.activity = !this.activity;
      },
    // actOn() {this.activity = true},
    // actOff() {this.activity = false},
    showDetailPageModally(item) {
      this.$showModal(alumDetail, {
        props: {
          name: item.name,
          occupation: item.occupation,
          src: item.src,
          eng_sci: item.eng_sci,
          medical: item.medical,
          corporate: item.corporate
        }
      });
    },

    onItemTap: function(event) {
      // console.log("ID of object tapped: " + this.$data.localdata[event.index]._id);
      // console.log("Object name tapped: " + this.$data.localdata[event.index].name);
      this.$data.todelete = this.$data.localdata[event.index]._id;
      this.deleteData();
    },

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

          // if client confirms wants to add data, connect to Kinvey and addData

          if (result) {
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
                //console.log("now inside promised update data after save update");
                vm.getData();
                alert("Data successfully added");
              })
              .catch(function(error) {
                console.log("Error with adddata() method:" + error);
              });
          }
        });
    },

    updateData() {
      // create a variable to hold 'this' so it can used inside of other function scopes

      var vm = this;
      vm.activity = true;

      // confirm if user wants to update data to Kinvey Server

      dialogs
        .confirm({
          title: "Update Data",
          message: "Do you want to update this data to the server?",
          okButtonText: "Yes",
          cancelButtonText: "No"
        })
        .then(function(result) {
          // result argument is boolean

          // if client confirms wants to update data, connect to Kinvey and update

          if (result) {
            // establish Kinvey connection dataStore

            const dataStore = Kinvey.DataStore.collection(
              "members",
              Kinvey.DataStoreType.Auto
            );

            /* Used in debugging
              // var count = 0;
              //const entAdd = vm.localdata[0];
              //const entAdd = vm.localdata["5e0993b02e5dcb0016db072d"];
              // update Kinvey dataStore with local dataStore when update button clicked
              //vm.localdata[3].occupation = "Painter";
            */

            // Loop through local dataStore, to create an object in format Kinvey format
            // Once a suitable object is created, save it to the Kinvey server

            vm.localdata.forEach(item => {
              //console.log("Item name and occupation"+ count + item.name + item.occupation);
              var saveObject = {
                _id: item._id,
                name: item.name,
                occupation: item.occupation,
                src: item.src,
                eng_sci: item.eng_sci,
                medical: item.medical,
                corporate: item.corporate
              };
              dataStore
                .save(saveObject)
                .then(function(entity) {
                  //console.log("just completed updating server with local data");
                  //vm.getData(); - if using later need to work out data flow direction;
                  alert("Server updated successfully");
                })
                .then(() => {vm.activity = false;})
                .catch(function(error) {
                  console.log("error within update funciton:" + error);
                });
            });
          }
        });
    },

    getData() {
      // create a variable to hold 'this' so I can used inside of other function scopes

      var vm = this;
      vm.activity = true;

      // establish a Kinvey connection dataStore

      const dataStore = Kinvey.DataStore.collection(
        "members",
        Kinvey.DataStoreType.Auto
      );

      // get dataStore data, and store it locally in a Vue data array

      dataStore.find().then(
        items => {
          vm.localdata = [];
          items.forEach(item => {
            vm.localdata.push(item);
          });
        },
        error => {
          console.log("error in getData method:" + error);
        }
      ).then(() => {vm.activity = false;})
    },
    deleteData() {
      // create a variable to hold 'this' so I can used inside of other function scopes

      var vm = this;

      // confirm want to delete data, then remove it from Kinvey server

      dialogs
        .confirm({
          title: "Delete Data",
          message: "Do you want to delete this entry from the server?",
          okButtonText: "Yes",
          cancelButtonText: "No"
        })
        .then(function(result) {
          // result argument is boolean

          // establish a Kinvey connection dataStore

          const dataStore = Kinvey.DataStore.collection(
            "members",
            Kinvey.DataStoreType.Auto
          );

          //object for id/data that we want to remove from Kinvey server

          const remID = { _id: vm.todelete };

          //remove object with _id from Kinvey server

          var promise = dataStore
            .removeById(remID._id)
            .then(function(result) {
              vm.getData();
            })
            .catch(function(error) {
              console.log("Error in delete method:" + error);
            });
        });
    }
  },
  computed: {
    navigationButtonClasses() {
      return component => ({
        fas: true,
        tabicons: true,
        "nav-btn": true,
        purple: component === this.currentComponent
      });
    },
    iconColWhite() {
      return component => ({
        fas: true,
        skillIcons: true,
        whiteSkill: component === false
      });
    },
    filterList: function() {
      if (item.name === "defaultSearch") {
        return localdata;
      } else {
        data.filter(item => {
          return item.name.includes(this.searchQuery);
        });
      }
    }
  },

  created() {
    // create a variable to hold 'this' so I can used inside of other function scopes

    var vm = this;
    vm.activity = true;

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
        // console.log("Kinvey ping connection received - now get data collection");

        // check active user once data received from Kinvey (add if statement later)

        const activeUser = Kinvey.User.getActiveUser();
        if (activeUser == null) {
          console.log("active user is null inside Home.vue");
        } else {
          console.log("active user is:" + activeUser);
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
      .then(() => {vm.activity = false;})
      .catch(function(error) {
        console.log(
          "&&&&&&&& Kinvey NOT linked within Home.vue &&&&&&&&. Response: " +
            error.description
        );
      });
  }
};
</script>

<style scoped>
.nav-btn {
  color: #9d95b4;
  margin: 20;
  font-size: 30;
  padding: 10;
}

.actioncol {
  background-color: #073267;
}

.purple {
  background-color: #073267;
  color: white;
  font-size: 30;
  border-radius: 10;
}
</style>

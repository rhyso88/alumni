<template>
  <Page actionBarHidden="true">

    <GridLayout rows="70, *, auto" columns="*, *, *">

       <!-- hide main components until loaded appLoading = true -->

       <Button row="0" col="0" rowSpan="3" colSpan="3" class="btn btn-primary" text="Toggle Page Load" v-show="appLoading"
       @tap="togglePageLoad"></Button>

       <!-- main components to show once loaded - appLoading = false -->

      <Image
        src="~/assets/images/BD_reg_white_bg.png"
        class="topLogo"
        stretch="aspectFit"
        row="0"
        col="0"
        colSpan="1"
        v-show="!appLoading"
      />
      <Button row="0" col="1" class="btn btn-primary" text="actOn/Off" @tap="toggleAct" v-show="!appLoading" ></Button>
      <Button row="0" col="2" class="btn btn-primary" text="Logout" @tap="logout" v-show="!appLoading"></Button>

      <!-- main components all on top of each other, since only 1 will be visible at any given time -->

      <!--<ActivityIndicator row="1" col="0" colSpan="3" :busy="activity" v-show="activity"/>-->

      <ScrollView
        orientation="vertical"
        row="1"
        col="0"
        colSpan="3"
        v-show="'AddressBook' === currentComponent & !appLoading"
      >
        <ListView for="item in localdata" height="800">
          <v-template>
            <GridLayout rows="*" columns="auto,*,auto,auto,auto" @tap="showDetailPageModally(item)">
              <Image row="0" col="0" :src="item.src" class="thumb img-circle" stretch="aspectFill"/>
              <Label row="0" col="1" :text="item.name" />
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

      <!--Noticeboard page -->

      <ScrollView orientation="vertical" row="1" col="0" colSpan="3"
        v-show="'Noticeboard' === currentComponent & !appLoading">
       <ListView for="item in localposts" height="800">
          <v-template>
            <GridLayout rows="*" columns="auto,*,*,auto,auto,auto">
              <Image row="0" col="0" :src="item.profpic" class="thumb img-circle" stretch="aspectFill"/>
              <Label row="0" col="1" :text="item.userposting" />
              <Label row="0" col="2" :text="item.time_add" />
              <Label row="0" col="3" :class="iconColWhite(item.eng_sci)" :text="'fa-tools' | fonticon"/>
              <Label row="0" col="4" :class="iconColWhite(item.medical)" :text="'fa-stethoscope' | fonticon"/>
              <Label row="0" col="5" :class="iconColWhite(item.corporate)" :text="'fa-briefcase' | fonticon"/>
            </GridLayout>
          </v-template>
        </ListView>
      </ScrollView>

      <!--Alerts page -->

      <ScrollView orientation="vertical" row="1" col="0" colSpan="3"
        v-show="'Alerts' === currentComponent & !appLoading">
      </ScrollView>

      <!-- Bottom navigation -->
      <Button
        :class="navigationButtonClasses('AddressBook')"
        @tap="currentComponent = 'AddressBook'"
        :text="'fa-address-card' | fonticon"
        row="2"
        col="0"
        v-show="!appLoading"
      />
      <Button
        :class="navigationButtonClasses('Noticeboard')"
        @tap="currentComponent = 'Noticeboard'"
        :text="'fa-newspaper' | fonticon"
        row="2"
        col="1"
        v-show="!appLoading"
      />
      <Button
        :class="navigationButtonClasses('Alerts')"
        @tap="currentComponent = 'Alerts'"
        :text="'fa-bell' | fonticon"
        row="2"
        col="2"
        v-show="!appLoading"
      />
    </GridLayout>
  </Page>
</template>

<script>
// import required

import Login from "./Login";
import * as Kinvey from "kinvey-nativescript-sdk";
var dialogs = require("tns-core-modules/ui/dialogs");
import ProfModal from "./ProfModal";

// rest of Vue code

export default {
  data() {
    return {

      //Home & Modal Page data

      appLoading: true,
      toSearch: false,
      searchQuery: "defaultSearch",
      currentComponent: "AddressBook",
      componentsArray: ["AddressBook", "Noticeboard", "Alerts"],
      localdata: [],
      todelete: "_id of object you want to delete will go here",
      activity: false,

      //Post page data
      
      localposts:[],

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
    togglePageLoad() {
      this.appLoading = !this.appLoading;
      },
    // actOn() {this.activity = true},
    // actOff() {this.activity = false},
    showDetailPageModally(item) {
      this.$showModal(ProfModal, {
        props: {
          name: item.name,
          occupation: item.occupation,
          src: item.src,
          eng_sci: item.eng_sci,
          medical: item.medical,
          corporate: item.corporate,
          workplace: item.workplace,
          interest: item.interest,
          qualification: item.qualification,
          email: item.email
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
                corporate: item.corporate,
                workplace:item.workplace,
                interest:item.interest,
                qualification:item.qualification,
                email:item.email
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
      // vm.activity = true;

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
      ).then(() => {
        //vm.activity = false;
        })
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

  /* Tried to get loading screen to work - no success

  mounted() {
    var vm = this;
    console.log("Reached Mounting Stage");
    vm.appLoading=true;
    setTimeout(function(){
      vm.appLoading=false, 3000;
    })
  },

  */

  created() {
    // create a variable to hold 'this' so I can used inside of other function scopes

    var vm = this;
    // vm.activity = true;
    // console.log("Reached Created Stage")

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

        // first establish dataStore from Kinvey, with 'Auto' data type, get Alumni

        const dataStore = Kinvey.DataStore.collection(
          "members",
          Kinvey.DataStoreType.Auto
        );

        // now store the dataStore locally in an array, for Alumni

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
      .then(function(pass){

        // Get post data from 'posts' collection

        const postStore = Kinvey.DataStore.collection(
          "posts",
          Kinvey.DataStoreType.Auto
        );

        // now store the dataStore locally in an array, for Alumni

        postStore.find().then(
          items => {
            //console.log(items);
            //vm.message = "changed inside datastore twice";
            items.forEach(item => {
              vm.localposts.push(item);
            });
          },
          error => {
            console.log("stream error found retriving posts:" + error);
          }
        );
      }
      )
      .then(() => {
        // vm.activity = false;
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

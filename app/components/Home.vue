<template>
  <Page actionBarHidden="true">

    <GridLayout rows="70,auto ,*, auto" columns="*, *, *">

      <StackLayout horizontalAlignment="center" verticalAlignment="center" v-if="!mainReady">
         <ActivityIndicator :busy="mainAction" width="300" height="300"/>
      </StackLayout>

       <!-- hide main components until loaded mainReady = true-->

       

       <!-- main components to show once loaded - appLoading = false -->


      <Image
        src="~/assets/images/BD_reg_white_bg.png"
        class="topLogo"
        height="60"
        row="0"
        col="0"
        colSpan="2"
        stretch="aspectFit"
        v-if="mainReady"
      />

      
      
      <Button row="0" col="2" class="btn btn-primary" text="Logout" @tap="logout" v-if="mainReady"></Button>

      <!-- main components all on top of each other, since only 1 will be visible at any given time -->

      <StackLayout row="1" col="0" colSpan="3" v-show="'AddressBook' === currentComponent & mainReady">
        <SearchBar hint="Search Alumni..." v-model="searchAlumni" @textChange="filterAlumni" />
      </StackLayout>


      <ScrollView
        orientation="vertical"
        row="2"
        col="0"
        colSpan="3"
        v-show="'AddressBook' === currentComponent & mainReady"
      >

        <ListView for="item in filteredAlumni" height="800">
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

    <Stacklayout row="2" col="0" colSpan="3" v-show="'Noticeboard' === currentComponent & mainReady">
      <FlexboxLayout justifyContent="center" alignItems="center" verticalAlignment="middle">
        <Label :text="'fa-plus' | fonticon" class="fas plusIcon" @tap="addPostMod"/>
      </FlexboxLayout>
      <StackLayout>
        <SearchBar hint="Search Noticeboard..." v-model="searchNotice" @textChange="filterList" />
      </StackLayout>
      <ScrollView orientation="vertical">
        <ListView for="item in filteredPost" height="800">
          <v-template>
            <Gridlayout rows="*,*" columns="auto,*,auto" @tap="viewPostMod(item)">
                <Image row="0" col="0" rowSpan="2" :src="item.profpic" stretch="aspectFill" class="postImg pictureBack"/>
                <Label row="0" col="1" :text="item.userposting" class="userPoster"/>
                <Label row="1" col="1" :text="item.post_title" class="userPoster"/>
                <Label row="0" col="2" :text="item.time_add" class="dateViewPost" style="text-align:center;" />
                <FlexboxLayout row="1" col="2" justifyContent="flex-end" alignItems="center" verticalAlignment="middle" class="dateViewPost"> 
                  <Label :text="'fa-eye' | fonticon" class="fas" v-if="item.seen"/> 
                  <Label :text="'fa-eye-slash' | fonticon" class="fas" v-else/>
                  <Label :text="item.no_seen"/>
                </FlexboxLayout>
            </Gridlayout>
          </v-template>
        </ListView>
      </ScrollView>
    </Stacklayout>


      <!--Alerts page -->

      <ScrollView orientation="vertical" row="2" col="0" colSpan="3"
        v-show="'Alerts' === currentComponent & mainReady">
        <StackLayout backgroundColor="#3c495e" orientation="horizontal">
          <ListView for="item in filteredPost" height="800">
          <v-template>
            <StackLayout @tap="viewPostMod(item)">
                  <Image row="0" col="0" rowSpan="2" :src="item.profpic" stretch="aspectFill" class="postImg pictureBack"/>
                  <Label row="0" col="1" :text="item.userposting" class="userPoster"/>
                  <Label row="1" col="1" :text="item.post_title" class="userPoster"/>
                  <Label row="0" col="2" :text="item.time_add" class="dateViewPost" style="text-align:center;" />
                  <Label :text="'fa-eye' | fonticon" class="fas" v-if="item.seen"/> 
                  <Label :text="'fa-eye-slash' | fonticon" class="fas" v-else />
                  <Label :text="item.no_seen"/>
            </StackLayout>
          </v-template>
        </ListView>
        </StackLayout>
      </ScrollView>

      <!-- Bottom navigation -->
      <Button
        :class="navigationButtonClasses('AddressBook')"
        @tap="currentComponent = 'AddressBook'"
        :text="'fa-address-card' | fonticon"
        row="3"
        col="0"
        v-show="mainReady"
      />
      <Button
        :class="navigationButtonClasses('Noticeboard')"
        @tap="currentComponent = 'Noticeboard'"
        :text="'fa-newspaper' | fonticon"
        row="3"
        col="1"
        v-show="mainReady"
      />
      <Button
        :class="navigationButtonClasses('Alerts')"
        @tap="currentComponent = 'Alerts'"
        :text="'fa-bell' | fonticon"
        row="3"
        col="2"
        v-show="mainReady"
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
import ViewPostModal from "./ViewPostModal";
import AddPostModal from "./AddPostModal";

// rest of Vue code

export default {
  data() {
    return {

      //Home & Modal Page data

      mainReady: false,
      mainAction:true,
      toSearch: false,
      searchQuery: "defaultSearch",
      currentComponent: "AddressBook",
      componentsArray: ["AddressBook", "Noticeboard", "Alerts"],
      localdata: [],
      todelete: "_id of object you want to delete will go here",
      activity: false,
      searchAlumni:"",
      filteredAlumni:[],
      

      //Post page data
      searchNotice:"",
      localposts:[],
      filteredPost:[],

    };
  },
  methods: {
    logout() {
      this.mainReady = false;
      setTimeout(() => {
        this.$backendService.logout();
        this.$navigateTo(Login, {
        clearHistory: true
        });
      }, 2000)
    },
    toggleAct() {
      this.activity = !this.activity;
      },

    filterAlumni() {
      
      var vm = this;

      if (vm.searchAlumni === "") {
          vm.filteredAlumni = vm.localdata
          }
      else {

      var filteredAddress = vm.localdata.filter(obj => {
        return vm.siftList(obj.name,vm.searchAlumni) || vm.siftList(obj.occupation,vm.searchAlumni);
      });

      vm.filteredAlumni = filteredAddress;

      }

    },

    filterList() {
      
      var vm = this;

      if (vm.searchNotice === "") {
          // console.log("nothing to search!!!")
          vm.filteredPost = vm.localposts
          }
      else {

      // vm.filteredPost = [];
      // console.log("Text changed now to:"+ this.searchNotice);

      // var outcome = this.siftList("lookingforRhys",this.searchNotice);

      // console.log(outcome)

      var filteredNoticeboard = vm.localposts.filter(obj => {
        return vm.siftList(obj.userposting,vm.searchNotice) || vm.siftList(obj.post_title,vm.searchNotice);
      });

      vm.filteredPost = filteredNoticeboard;

      //console.log("Local post array contains following:" + this.localposts)

      // console.log(JSON.stringify(filteredNoticeboard))

      }

    },

    siftList(text,query) {
        return text.toLowerCase().indexOf(query.toLowerCase()) >= 0
    },

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
    addPostMod(){
      console.log("Modal blog page posted by: ")
      this.$showModal(AddPostModal, {
        props: {}
      }).then(this.getData);
    },

    viewPostMod(item){
      console.log("Modal view of the following users post:  "+ item.userposting)
      // **ON ENTRY - increase view count**//
      this.$showModal(ViewPostModal, {
        props: {
          profpic: item.profpic,
          userposting: item.userposting,
          post_title: item.post_title,
          post_content: item.post_content,
          eng_sci: item.eng_sci,
          medical: item.medical,
          corporate: item.corporate,
          time_add: item.time_add,
          seen: item.seen,
          no_seen: item.seen,
          email:item.email
        }
      })
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

      // create a variable to hold 'this' (for use inside other function scopes)

      var vm = this;
      vm.activity = true;
      this.localdata = [];
      this.localposts = [];

      // Establish Kinvey datastore connection with collection "members"

      const dataStore = Kinvey.DataStore.collection(
        "members",
        Kinvey.DataStoreType.Auto
      );

      // now store the dataStore locally in an array, for Alumni

      dataStore.find().then(
        items => {
          items.forEach(item => {
            vm.localdata.push(item);
          });
        },
        error => {
          console.log("Error getting members data:" + error);
        }
      )
      .then(vm.filteredAlumni = vm.localdata)
      .then(function(pass){

      // Get post data from 'posts' collection

      const postStore = Kinvey.DataStore.collection(
        "posts",
        Kinvey.DataStoreType.Auto
      );

      // Store post data locally

      postStore.find().then(
        items => {
          items.forEach(item => {
            vm.localposts.push(item);
          });
        },
        error => {
          console.log("stream error found retriving posts:" + error);
        }
      )
      })
      .then(function(){
        vm.activity = false
        vm.filteredPost = vm.localposts
      })
      .catch(function(error) {
        console.log(
          "&&&&&&&& Kinvey NOT linked within Home.vue &&&&&&&&. Response: " +
            error.description
        );
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
  },

  mounted () {
    var vm = this;
    setTimeout(() => {
      vm.getData()
      console.log("inside mounted command")
      vm.mainReady=true
      }, 3000)
  },

  created() {
    // create a variable to hold 'this' so I can used inside of other function scopes

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

.postImg{
  width: 60;
	height: 60;
	border-radius:30;
}

.postFriendName{
	font-weight: bold;
	font-size: 19;
}

.postTextOut{
	font-size: 15;
}

.postDateOut{
	font-size: 15;
}

.pictureBack {
  background-color:#BBDEFB;
}

.userPoster {
  background-color: #E1BEE7;
}

.dateViewPost {
  background-color: #FFCDD2;
}

.plusIcon {
  font-size:30;
}
.padBoxMarg {
  padding-top:10;
}

</style>

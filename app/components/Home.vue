<template>
  <Page actionBarHidden="true">
    <StackLayout height="100%" width="100%">

      <!--Loading Stage - show this -->

      <Gridlayout rows="*" columns="*" v-show="!mainReady">
          <Image col="0" row="0" ref="waiting" src="~/assets/login_image/BD_reg_stacked.png" class="intro" height="100"
            stretch="aspectFit" horizontalAlignment="center" verticalAlignment="center"/>
      </Gridlayout>

      <!-- Main Components - Row 1 all on top of each other, using v-show to display them -->

      <GridLayout :rows="navHeight + ',*,'+tabHeight" columns="*, *, *" @swipe="onSwipe" v-show="mainReady" ref="mainPages">

        <!-- Top Bar - Row 0 -->

        <Gridlayout row="0" col="0" colSpan="3" rows="*" columns="*" class="borderBottom navBackground">
          <Image row="0" col="0" src="~/assets/header_v2/BD_rev_transp.png" stretch="aspectFit" @tap="logout2"
            class="navBarImage" android:style="margin-top:10;"/>
        </Gridlayout>

        <!-- activity indicator will appear when 'activity' is true - which is when contacting Kinvey server getdata -->

        <ActivityIndicator row="1" col="0" colSpan="3" :busy="activity" width="300" height="300" 
          horizontalAlignment="center" verticalAlignment="center"/>

        <!-- Addressbook Page -->
      
        <Stacklayout row="1" col="0" colSpan="3" height="100%" width="100%" v-show="'AddressBook' === currentComponent & mainReady & !activity">
            <GridLayout rows="auto" columns="*,auto" class="noticeBackground borderBottom borderAll">
              <GridLayout col="0" height="40" rows="*" columns="auto,*,auto" @tap="dismissKeyboard" class="searchBarBack">
                <Label col="0" :text="'fa-search' | fonticon" class="fas searchIcons" horizontalAlignment="center" verticalAlignment="center"/>
                <TextView col="1" hint="Search Alumni..." v-model="searchAlumni" 
                    @textChange="filterAlumni"
                    @submit="dismissKeyboard"
                    ref="alumSearchBar"
                    maxLength="30"
                    width="100%"
                    class="removeBlueUnderline"/>
                <Label col="2" :text="'fa-times' | fonticon" class="fas searchIcons" @tap="clearText" horizontalAlignment="center" verticalAlignment="center"/>
              </GridLayout>
              <Label col="1" :text="'fa-tools' | fonticon" class="fas filterIcon" @tap="toggleAlumSkill" v-if="filterEngSci" />
              <Label col="1" :text="'fa-stethoscope' | fonticon" class="fas filterIcon" @tap="toggleAlumSkill" v-else-if="filterMedical" />
              <Label col="1" :text="'fa-briefcase' | fonticon" class="fas filterIcon" @tap="toggleAlumSkill" v-else-if="filterCorporate" />
              <Label col="1" :text="'fa-filter' | fonticon" class="fas filterIcon" @tap="toggleAlumSkill" v-else/>
            </Gridlayout>
            <ListView for="item in filteredAlumni" height="700">
              <v-template>
                <Gridlayout height="75" width="95%" rows="*" columns="auto,*,auto,auto,auto" 
                  @tap="showDetailPageModally(item)">
                    <Image row="0" col="0" :src="item.src" class="postImg" stretch="aspectFill"/>
                    <Label row="0" col="1" :text="item.name" class="alumniTitle"/>
                    <Label row="0" col="2" class="fas skillIcons" :text="'fa-tools' | fonticon" v-show="item.eng_sci"/>
                    <!--<Label row="0" col="2" class="fas skillIcons" :text="'fa-tools' | fonticon" v-else color="white"/>-->
                    <Label row="0" col="3" class="fas skillIcons" :text="'fa-stethoscope' | fonticon" v-show="item.medical"/>
                    <!--<Label row="0" col="3" class="fas skillIcons" :text="'fa-stethoscope' | fonticon" v-else color="white"/>-->
                    <Label row="0" col="4" class="fas skillIcons" :text="'fa-briefcase' | fonticon" v-show="item.corporate"/>
                    <!--<Label row="0" col="4" class="fas skillIcons" :text="'fa-briefcase' | fonticon" v-else color="white"/>-->
                </Gridlayout>
              </v-template>
            </ListView>
        </Stacklayout>
      
        <!--Noticeboard page  - define the size of the rows using a stack (allows child gridlayout to work well) -->

        <Stacklayout row="1" col="0" colSpan="3" height="100%" width="100%" v-show="'Noticeboard' === currentComponent & mainReady & !activity">
            <GridLayout rows="auto" columns="*,auto" class="noticeBackground borderBottom borderAll">
              <GridLayout col="0" height="40" rows="*" columns="auto,*,auto" @tap="dismissKeyboard" class="searchBarBack">
                <Label col="0" :text="'fa-search' | fonticon" class="fas searchIcons" horizontalAlignment="center" verticalAlignment="center"/>
                <TextView col="1" hint="Search Noticeboard..." v-model="searchNotice" 
                    @textChange="filterList" 
                    @submit="dismissKeyboard" 
                    ref="noticeboardSearchBar"
                    maxLength="30"
                    width="100%"
                    class="removeBlueUnderline"/>
                <Label col="2" :text="'fa-times' | fonticon" class="fas searchIcons" @tap="clearText" horizontalAlignment="center" verticalAlignment="center"/>
              </GridLayout>
              <Label col="1" :text="'fa-edit' | fonticon" class="fas plusIcon" @tap="addPostMod"/>
            </Gridlayout>
            <ListView for="item in filteredPost" height="700">
              <v-template>
                <Gridlayout height="75" width="95%" rows="*,*" columns="auto,*,auto" @tap="viewPostMod(item)">
                    <Image row="0" col="0" rowSpan="2" :src="item.profpic" stretch="aspectFit" class="postImg"/>
                    <Label row="0" col="1" :text="item.post_title" class="postTitle" fontWeight="bold"/>
                    <Label row="1" col="1" :text="item.userposting" class="userPosting"/>
                    <Label row="0" col="2" :text="item.time_add"  fontAttributes="Italic" style="text-align:right;"/>
                    <GridLayout row="1" col="2" rows="*" columns="*,auto" horizontalAlignment="right">
                      <Label col="0" :text="'fa-eye' | fonticon" class="fas" v-if="item.seen" color="#2196F3"/> 
                      <Label col="0" :text="'fa-eye-slash' | fonticon" class="fas" v-else/>
                      <Label col="1" :text="item.no_seen"/>
                    </GridLayout>
                </Gridlayout>
              </v-template>
            </ListView>
        </Stacklayout>


        <!--Alerts page -->

        <StackLayout row="1" col="0" colSpan="3" height="100%" width="100%" class="alertBackGround"
          v-show="'Alerts' === currentComponent & mainReady & !activity">
            <ListView for="item in localAlerts" height="700" separatorColor="transparent" >
                <v-template>
                  <StackLayout height="500" width="95%">
                    <card-view elevation="40" radius="1">
                      <Image :src="item.src"  width="100%" stretch="aspectFit"/>
                    </card-view>
                  </StackLayout>
                </v-template>
          </ListView>
        </StackLayout>

        <!-- Bottom navigation -->
        <GridLayout row="2" col="0" colSpan="3" rows="*" columns="*,*,*" v-show="mainReady" 
          class="borderTop navBackground" android:style="padding-bottom:5;padding-top:5;">
          <Button
            :class="navigationButtonClasses('AddressBook')"
            @tap="currentComponent = 'AddressBook'"
            :text="'fa-address-card' | fonticon"
            col="0"
            v-show="mainReady"
          />
          <Button
            :class="navigationButtonClasses('Noticeboard')"
            @tap="currentComponent = 'Noticeboard'"
            :text="'fa-newspaper' | fonticon"
            col="1"
            v-show="mainReady"
          />
          <Button
            :class="navigationButtonClasses('Alerts')"
            @tap="currentComponent = 'Alerts'"
            :text="'fa-bell' | fonticon"
            col="2"
            v-show="mainReady"
          />
        </GridLayout>
      </GridLayout>
    </StackLayout>
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
const SwipeDirection = require("tns-core-modules/ui/gestures").SwipeDirection;


//required to color android status bar
import * as app from 'tns-core-modules/application'
import * as platform from 'tns-core-modules/platform'
import * as color from 'tns-core-modules/color'

//required to hide android keyboard
import * as utils from "utils/utils";
import { isIOS, isAndroid } from "platform";
import * as frame from "ui/frame";


// rest of Vue code

export default {
  data() {
    return {

      //Home & Modal Page data

      mainReady: false,
      mainAction:true,
      toSearch: false,
      viewMainPages:false,
      searchQuery: "defaultSearch",
      currentComponent: "AddressBook",
      componentsArray: ["AddressBook", "Noticeboard", "Alerts"],
      todelete: "_id of object you want to delete will go here",
      activity: false,

      //Alumni data page
      searchAlumni:"",
      localdata: [],
      filteredAlumni:[],
      filterEngSci: false,
      filterMedical: false,
      filterCorporate: false,
      filterCount:0,
      filterSkillArray: ["eng_sci","medical","corporate"],

      //Post page data
      searchNotice:"",
      localposts:[],
      filteredPost:[],

      //Alert page data
      localAlerts:[],

      //Modal page android setting (default is false for Iphone - non full screen modal)
      androidModal: false

    };
  },
  methods: {
    navColorChange() {
      if (app.android && platform.device.sdkVersion >= "21") {
          const window = app.android.foregroundActivity.getWindow();
          window.setStatusBarColor(new color.Color("#073267").android);
      }
    },
    navColorChangeWhite() {
      if (app.android && platform.device.sdkVersion >= "21") {
          const window = app.android.foregroundActivity.getWindow();
          window.setStatusBarColor(new color.Color("#FFFFFF").android);
      }
    },

    logout() {
      setTimeout(() => {
        this.mainReady = false;
        this.$backendService.logout();
        this.$navigateTo(Login, {clearHistory: true, 
          transition: {
            name:'fade',
            duration: 500
          }
        });
      }, 3000)
    },

    logout2() {

      var vm = this

      dialogs
        .confirm({
          title: "Logout",
          message: "Are you sure you want to logout?",
          okButtonText: "Yes",
          cancelButtonText: "No"
        })
        .then(function(result) {
          // console.log("Inside logout with result returned: " + result)
          if (result) {
            let element = vm.$refs.mainPages.nativeView
            element.animate({ opacity: 0, duration:1000})
              .then(function () { return vm.navColorChangeWhite(); })
              .then(function () { return vm.mainReady = false; })
              .then(function () { return vm.$backendService.logout(); })
              .then(function () { return vm.$navigateTo
                (Login, {
                  clearHistory: true , 
                  transition: {name:'fade',duration: 500}
                  }
                ); 
              })
              .catch(function (e) {
              console.log("logout2 error :"+ e.message);
              });
            }
          }
        )
    },

    fadeOther() {
    let element = this.$refs.fadeNow.nativeView
     element.animate({
        opacity: 0,
        duration: 3000,
        iterations: 1
      });
    },

    whileWait() {
      let pic = this.$refs.waiting.nativeView
      console.log("In startup animation")
      pic.animate({
        opacity: 0,
        duration: 3000,
        iterations: Number.POSITIVE_INFINITY
      });
    },

    fadeLogOut() {
    let element = this.$refs.mainPages.nativeView
     element.animate({
        opacity: 0,
        duration: 3000,
        iterations: 1
      });
    },

    tryAnim() {
      let pic = this.$refs.fadeNow.nativeView
      pic.opacity = 0.5
      console.log("In oritingal animation "+ pic)
      pic.animate({
        opacity: 0,
        duration: 1000,
        iterations: Number.POSITIVE_INFINITY
      });

    },
    toggleAct() {
      this.activity = !this.activity;
      },

    dismissKeyboard() {
      this.$refs.alumSearchBar.nativeView.dismissSoftInput()
      this.$refs.noticeboardSearchBar.nativeView.dismissSoftInput()
    },

   toggleAlumSkill() {

    var vm = this;
    vm.filterCount += 1
    if (vm.filterCount > 3) {vm.filterCount = 0}
    switch (vm.filterCount) {
      case 0:
        vm.filterEngSci = false,
        vm.filterMedical = false,
        vm.filterCorporate = false,
        vm.filterAlumni()
        break;
      case 1:
        vm.filterEngSci = true,
        vm.filterMedical = false,
        vm.filterCorporate = false,
        vm.filterAlumni()
        break;
      case 2:
        vm.filterEngSci = false,
        vm.filterMedical = true,
        vm.filterCorporate = false,
        vm.filterAlumni()
        break;
      case 3:
        vm.filterEngSci = false,
        vm.filterMedical = false,
        vm.filterCorporate = true,
        vm.filterAlumni()
        break;
    }
   },

    filterAlumni() {
      
      var vm = this;

        if (vm.searchAlumni === "" & vm.filterCount === 0) {
            vm.filteredAlumni = vm.localdata
            vm.$refs.alumSearchBar.nativeView.dismissSoftInput()
            }
        else if (vm.filterCount === 0) {
          vm.filteredAlumni = vm.localdata.filter(obj => {
          return (vm.siftList(obj.name,vm.searchAlumni) || vm.siftList(obj.occupation,vm.searchAlumni)) 
          });
        }

        else {

          // get count for array position of skill

          var adj_count = vm.filterCount-1
          var filterSkillButton = vm.filterSkillArray[adj_count]

          vm.filteredAlumni = vm.localdata.filter(obj => {
            return (vm.siftList(obj.name,vm.searchAlumni) || vm.siftList(obj.occupation,vm.searchAlumni)) 
              && eval("obj."+filterSkillButton) === true
          });

          // vm.filteredAlumni = filteredAddress;
        }
    },

    filterList() {
      
      var vm = this;

      if (vm.searchNotice === "") {
          vm.filteredPost = vm.localposts
          this.$refs.noticeboardSearchBar.nativeView.dismissSoftInput()
          }
      else {

      vm.filteredPost = vm.localposts.filter(obj => {
        return vm.siftList(obj.userposting,vm.searchNotice) || vm.siftList(obj.post_title,vm.searchNotice);
      });

      // vm.filteredPost = filteredNoticeboard;

      }
    },

    siftList(text,query) {
        return text.toLowerCase().indexOf(query.toLowerCase()) >= 0
    },

    showDetailPageModally(item) {
      this.$showModal(ProfModal, {
        fullscreen: this.androidModal,
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
      // console.log("Modal blog page posted by: ")
      this.$showModal(AddPostModal, {
        fullscreen: this.androidModal,
        props: {}
      }).then(this.getData);
    },

    viewPostMod(item){
      // console.log("Modal view of the following users post:  "+ item.userposting)
      this.addSeen(item);
      this.$showModal(ViewPostModal, {
        fullscreen: this.androidModal,
        props: {
          _id: item._id,
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

    addSeen(item) {

      //establish connection to Kinvey

      var vm = this;

      const dataStore = Kinvey.DataStore.collection(
        "posts", 
        Kinvey.DataStoreType.Auto
      );

      //get current seen number, and increase by 1

      const seenOld = parseInt(item.no_seen,10);
      const seenNew = seenOld + 1;

      console.log("id returned from Kinvey:" + item._id);
      console.log("new seen count: " + seenNew);

      // add increased "seen count" 

      const entAdd = {
        _id: item._id, 
        //new stuff
        seen: true,
        no_seen: seenNew,
        //old stuff
        profpic: item.profpic,
        userposting: item.userposting,
        post_title: item.post_title,
        post_content: item.post_content,
        eng_sci: item.eng_sci,
        medical: item.medical,
        corporate: item.corporate,
        time_add: item.time_add,
        email:item.email
      };

      //increase local seen count

      function checkPos(pos) {
        return pos._id === item._id;
      }

      var ind = vm.localposts.findIndex(checkPos);
      console.log("Found the index: " + ind)
      vm.localposts[ind].no_seen = seenNew;
      vm.localposts[ind].seen = true;
    
      //increase remote seen count

      const promise = dataStore
        .save(entAdd)
        .then(function(entity) {
          // vm.getData();
          // console.log("Added seen data to Kinvey");
        })
        .catch(function(error) {
          console.log("Error with number of times seen method:" + error);
        });
    },

    onSwipe(args) {

      // Swipe gestures to move between tabs

      var vm = this

      if (args.direction == SwipeDirection.left & "AddressBook" === this.currentComponent & this.mainReady ) {
        vm.currentComponent = 'Noticeboard'
        }
      else if (args.direction == SwipeDirection.left & "Noticeboard" === this.currentComponent & this.mainReady) {
        vm.currentComponent = 'Alerts'
      }
      else if (args.direction == SwipeDirection.right & "Alerts" === this.currentComponent & this.mainReady) {
        vm.currentComponent = 'Noticeboard'
      }
      else if (args.direction == SwipeDirection.right & "Noticeboard" === this.currentComponent & this.mainReady) {
        vm.currentComponent = 'AddressBook'
      }
      else {
        //nothing
      }
    },

    clearText () {
      this.searchNotice = ""
      this.searchAlumni = ""
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
      this.localAlerts = [];

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
        vm.filteredPost = vm.localposts
      })
      .then(function(pass){

      // Get alert data from 'news' collection

      const postStore = Kinvey.DataStore.collection(
        "news",
        Kinvey.DataStoreType.Auto
      );

      // Store alert data locally

      postStore.find().then(
        items => {
          items.forEach(item => {
            vm.localAlerts.push(item);
          });
        },
        error => {
          console.log("Error found retrieving alerts/news: " + error);
        }
      )
      })
      .then(function(){
        vm.activity = false
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
    navHeight() {
      if(app.android) {
        return "60"
      }
      else {
        return "50"
      }
    },
    tabHeight() {
      if(app.android) {
        return "62"
      }
      else {
        return "49"
      }
    },

  },
  
  mounted () {
    var vm = this;
    setTimeout(() => {
      vm.getData()
      vm.mainReady=true
      vm.navColorChange()
      if (isAndroid)
        {vm.androidModal = true;}
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
  color: white;
  background-color: #073267;
  margin: 20;
  font-size: 30;
  padding: 10;
  z-index:0; /* Removes shadow around android buttons */
}

.navBackground {
  background-color: #073267;
}

.actioncol {
  background-color: #073267;
}

.purple {
  background-color: white;
  color: #073267;
  font-size: 30;
  border-radius: 10;
}

.postImg{
  width: 60;
	height: 60;
  border-radius:100;
  border-color:#000000;
  border-width: 1;
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

.userPosting {
  font-size: 13;
  margin-left:5;
}

.postTitle {
  font-size: 17;
  text-decoration: underline;
  margin-left:5;
}

.alumniTitle {
  font-size: 15;
  margin-left:5;
}

.plusIcon {
  font-size:20;
  margin-left: 10;
  margin-right:10;
  margin-top: 5;
  margin-bottom: 5;
  border-color:#000000;
  border-width: 1;
  border-radius:30;
  /*Padding special - asymetric object*/
  padding-left: 12;
  padding-right: 9;
  padding-bottom: 13;
  padding-top:10;
  background:#073267;
  color:#FFFFFF;
}

.filterIcon {
  font-size:20;
  margin-left: 10;
  margin-right:10;
  margin-top: 5;
  margin-bottom: 5;
  border-color:#000000;
  border-width: 1;
  border-radius:30;
  padding: 12;
  background:#073267;
  color:#FFFFFF;
}

.padBoxMarg {
  padding-top:10;
}

.alertPadding{
	padding-top: 30;
  padding-bottom: 30;
}

.borderTesting{
  border-color:#073267; 
	border-width: 1;
  /*background: #6f7cec;*/
}

.searchBar {
  border-color:#000000;
	border-width: 1;
  border-radius:15;
  margin-left: 10;
}

.noticeBackground {
  background: #eeeeee;
}

.removeBlueUnderline {
    /*color: #eeeeee;*/
    border-width: 0;
}

.searchBarBack {
    background: #FFFFFF;
    border-color:#000000;
    border-width: 1;
    border-radius:15;
    margin-left: 10;
}

.borderTopBottom {
  border-color:#000000;
  border-width: 1;
  border-right-width:0;
  border-left-width:0;
}

.borderTop {
  border-color:#000000;
  border-width: 1;
  border-right-width:0;
  border-left-width:0;
  border-bottom-width: 0;
}

.borderBottom {
  border-color: #000000;
  border-width: 1;
  border-right-width:0;
  border-left-width:0;
  border-top-width: 0;
}

.borderAll{
  border-color: #000000;
  border-width: 1;
}

.noBorder{
  border-right-width:0;
  border-left-width:0;
  border-top-width: 0;
  border-bottom-width: 0;
}


.searchIcons {
  margin-right: 10;
  margin-left: 10;
  font-size:20;
}


.appear {
  animation-name: example2;
  animation-duration: 3s;
  animation-fill-mode:forwards;
  animation-iteration-count: 1;
  animation-delay: 2.8s;
  
}

@keyframes example2 {
  from {opacity: 0;}
  to {opacity: 1;}
}

.navBarImage {
  margin-bottom: 10;
}

.alertBackGround {
  background: #eeeeee;
}

.rightSideList {
  margin-right: 10;
}

</style>
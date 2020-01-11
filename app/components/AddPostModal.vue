<template>
  <Page>

    <!-- Set boundaries for gridlayout - needs these to ensure rendering as planned -->

    <StackLayout class="" height="100%" width="100%">

    <!-- Set gridlayout which keeps portrait at top, and submit at bottom -->

        <GridLayout rows="auto,*,auto" columns="*" class="">

            <!-- Portrait Photo & Name -->

            <StackLayout row="0" col="0" horizontalAlignment="center" verticalAlignment="center" 
                class="">
                <Image :src="profpic" stretch="aspectFill" class="profilePic" verticalAlignment="center" ></Image>
                <Label :text="userposting" color="#000" fontSize="23" fontWeight="bold" class="labelCent" verticalAlignment="center"/>
            </StackLayout>

            <!-- Topic/Skills Required & Query -->
            <StackLayout row="1" col="0" class="" horizontalAlignment="center" 
                height="100%" width="100%">

                    <!-- Post Title **Limit to 15 characters ** -->
                    <Label text="Topic: " class="titleText" style="text-align:center;" fontWeight="bold"
                        textDecoration="underline"/>
                    <StackLayout class="textFieldBord" verticalAlignment="center">
                        <TextField v-model="post_title" hint="Enter post title <30 characters..." 
                        class="fieldText removeBlueUnderline" textWrap="true" maxLength="30"/>
                    </StackLayout>

                    <!-- Post Skills Required -->
                    <Label text="Skills Required: " class="titleText" style="text-align:center;" fontWeight="bold"
                        textDecoration="underline"/>
                    <FlexboxLayout class="textFieldBord" alignItems="center" justifyContent="center">
                        <StackLayout class="" @tap="toggleEngSci">
                            <Label class="fas skilReqModIcon" :text="'fa-tools' | fonticon" color="#53beb1"/>
                            <Label class="skilReqModIconText" text="Eng/Science" textWrap="true"/>
                            <Label class="fas skilReqYes" :text="'fa-check-circle' | fonticon"  v-if="eng_sci"/> 
                            <Label class="fas skilReqNo" :text="'fa-times-circle' | fonticon"  v-else />
                        </StackLayout>
                        <StackLayout class="" @tap="toggleMedical">
                            <Label class="fas skilReqModIcon" :text="'fa-stethoscope' | fonticon" color="#d16a6e"/>
                            <Label class="skilReqModIconText" text="Medicine" textWrap="true"/>
                            <Label class="fas skilReqYes" :text="'fa-check-circle' | fonticon" v-if="medical"/> 
                            <Label class="fas skilReqNo" :text="'fa-times-circle' | fonticon" v-else />
                        </StackLayout>
                        <StackLayout class="" @tap="toggleCorporate">
                            <Label class="fas skilReqModIcon" :text="'fa-briefcase' | fonticon" color="#55a3bb"/>
                            <Label class="skilReqModIconText" text="Corporate" textWrap="true"/>
                            <Label class="fas skilReqYes" :text="'fa-check-circle' | fonticon" v-if="corporate"/> 
                            <Label class="fas skilReqNo" :text="'fa-times-circle' | fonticon" v-else />
                        </StackLayout>
                    </FlexboxLayout>

                    <!-- Post Content **Limit to 100 characters - <50 words** -->
                    <Label text="Need Help With: " class="titleText" style="text-align:center;" fontWeight="bold" 
                        textDecoration="underline"/>
                    <StackLayout class="textFieldBord">
                        <TextView v-model="post_content" hint="Enter a short query <360 characters..." class="fieldText removeBlueUnderline" 
                            textWrap="true" maxLength="360" height="170"/>
                    </StackLayout>

            </StackLayout>

            <!-- Submit Post -->
            <StackLayout row="2" col="0" horizontalAlignment="center" verticalAlignment="center" class="" 
                @tap="addPost">
                <Label :text="'fa-pencil-alt' | fonticon" class="fas labelCent pencil"/>
                <Label class="skilReqModIconText" text="Add Post"/>
            </StackLayout>
        
        </GridLayout>
    </StackLayout>
  </Page>
</template>
 
<script>
var email = require("nativescript-email");
import * as Kinvey from "kinvey-nativescript-sdk";
var dialogs = require("tns-core-modules/ui/dialogs");

export default {
    props: [],
    data: function () {
      return {
          profpic:"",
          userposting:"",
          post_title:"",
          post_content:"",
          eng_sci:false,
          medical:false,
          corporate:false,
          time_add: "",
          seen: false,
          no_seen:"0",
          post_email:""
      }
    },
    methods: {
        toggleEngSci() {
            this.eng_sci = !this.eng_sci;
        },
        toggleMedical() {
            this.medical = !this.medical;
        },
        toggleCorporate() {
            this.corporate = !this.corporate;
        },
        addPost() {
        // create a variable to hold 'this' so it can used inside of other function scopes

        var vm = this;

        //Screen data input crudely

        if (!vm.post_title || !vm.post_content) {
            vm.alert("Please provide a post title and a post content");
            return;
        }

        // confirm if user wants to update data to Kinvey Server

        dialogs
            .confirm({
            title: "Add New Post",
            message: "Do you want to add this post to the Alumni Noticeboard?",
            okButtonText: "Yes",
            cancelButtonText: "No"
            })
            .then(function(result) {
            // result argument is boolean

            // if client confirms wants to update data, connect to Kinvey and update

            if (result) {
                // establish Kinvey connection dataStore

                const dataStore = Kinvey.DataStore.collection(
                "posts",
                Kinvey.DataStoreType.Auto
                );

                // Loop through local dataStore, to create an object in Kinvey format
                // Once a suitable object is created, save it to the Kinvey server

                // vm.localdata.forEach(item => {
                // console.log("Item name and occupation"+ count + item.name + item.occupation);
                var saveObject = {
                    profpic: vm.profpic,
                    userposting: vm.userposting,
                    post_title: vm.post_title,
                    post_content: vm.post_content,
                    eng_sci: vm.eng_sci,
                    medical: vm.medical,
                    corporate: vm.corporate,
                    time_add:vm.time_add,
                    seen:vm.seen,
                    no_seen:vm.no_seen,
                    email:vm.post_email
                }
                dataStore
                    .save(saveObject)
                    .then(function(entity) {
                    console.log("just completed adding new post to server");
                    // vm.getData(); - if using later need to work out data flow direction;
                    // alert("Added new post to Alumni Noticeboard");
                    })
                    .then(() => {
                        //vm.activity = false;
                        vm.$modal.close();
                    })
                    .catch(function(error) {
                    console.log("error within addPost() functioon:" + error);
                    });
                }
            });
        }
    },

    created() {

        var vm = this;
        var client = Kinvey.init({
            appKey: "kid_S1Gok7ARr",
            appSecret: "430e2c4f39c240e6970bd5683bf9cc09"
            });
        
        // Get current users name and portrait to attach to post
        
        vm.profpic = Kinvey.User.getActiveUser(client).data.portrait
        const user_fn = Kinvey.User.getActiveUser(client).data.first_name;
        const user_ln = Kinvey.User.getActiveUser(client).data.last_name;
        vm.userposting = user_fn + " " + user_ln;
        vm.post_email = Kinvey.User.getActiveUser(client).data.username;

        //Get current date and store in local data

        let today = new Date();

        // yyyy format, need to get final 2 numbers, so convert to string

            let year = today.getFullYear().toString(); 
            console.log("year: "+ year)
            let first = year[2];
            let sec = year[3];
            const twoYear = first + sec;
            console.log("shaped down version: "+ twoYear);

        // get month, add 1 as returns from 0-11, convert to 2 digit, then convert to string

            let month = today.getMonth() + 1;
            if (month<10) {
                var twoMonth = "0" + month.toString();
            }
            else {
                var twoMonth = month.String();
            }
            console.log("month: "+ twoMonth);

        //get day, put in 2 digit format and convert to string

            let day = today.getDate()
            if (day<10) {
                var twoDay = "0" + day.toString();
            }
            else {
                var twoDay = day.toString();

            }
            console.log("day: " +twoDay)

        // combine to the format wanted

            var combineDate = twoDay+ "/" + twoMonth+ "/" + twoYear
            console.log(combineDate)
            vm.time_add = twoDay + "/" + twoMonth + "/" + twoYear;

    }
};
</script>

<style scoped>

.titleText {
    font-size: 19;
    text-align: center;
    margin-bottom: 5;
    margin-top: 5;
}

.skilReqModIcon{
	text-align: center;
    font-size: 30;
    margin-left: 10;
    margin-right: 10;
    margin-top: 10;
}

.skilReqModIconText{
	text-align: center;
	font-size: 14;
    color:#000;
    margin-left: 15;
    margin-right: 15;
    margin-bottom: 5;
}

.skilReqYes{
    text-align: center;
    color:#A5D6A7;
    font-size: 20;
    margin-bottom: 10;
}
.skilReqNo{
    text-align: center;
    color:#EF9A9A;
    font-size: 20;
    margin-bottom: 10;
}

.pencil{
    color: #073267;
    font-size: 30;
}

.leftColText {
    font-size: 15;
}

.fieldText {
    font-size: 15;
    text-align: center;
    vertical-align: middle;
    padding-top: 5;
    padding-bottom: 5;
    padding-right: 5;
    padding-left: 5;
}

.textFieldBord {
    border-color:#000;
    border-width: 1;
    border-radius:15;
    width:90%;
    background: #eeeeee;
}

.borderTesting{
    border-color:#073267; 
	border-width: 1;
    /*background: #6f7cec;*/
}

.removeBlueUnderline {
    /*color: #eeeeee;*/
    border-width: 0;
}

</style>

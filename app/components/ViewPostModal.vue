<template>
    <Page>

        <!-- Set boundaries for gridlayout - needs these to ensure rendering as planned -->
    
        <StackLayout class="" height="100%" width="100%">
        
        <!-- Set gridlayout which keeps portrait at top, and submit at bottom -->

            <GridLayout rows="auto,*,auto" columns="*" class="">

                <!-- Portrait Photo & Name -->

                <StackLayout row="0" col="0" horizontalAlignment="center" verticalAlignment="center" class="">
                    <Image :src="profpic" stretch="aspectFill" class="profilePic" verticalAlignment="center"></Image>
                    <Label :text="userposting" color="#000" fontSize="23" fontWeight="bold" class="labelCent" verticalAlignment="center"/>
                </StackLayout>

                <!-- Information about Post -->
                 <StackLayout row="1" col="0" class="" horizontalAlignment="center" height="100%" width="100%">
                    
                        <!-- Post Title **Limit to 15 characters ** -->
                        <Label text="Topic:" class="titleText" style="text-align:center;" fontWeight="bold" 
                            textDecoration="underline"/>
                        <StackLayout class="textFieldBord" verticalAlignment="center">
                            <Label :text="post_title" class="fieldText" textWrap="true"/>
                        </StackLayout>

                        <!-- Post Skills Required -->
                        <Label text="Skills Required: " class="titleText" style="text-align:center;" fontWeight="bold" 
                            textDecoration="underline"/>
                        <FlexboxLayout class="textFieldBord" alignItems="center" justifyContent="center">
                            <StackLayout class="" v-if="eng_sci">
                                <Label class="fas skilReqModIcon" :text="'fa-tools' | fonticon" color="#53beb1"/>
                                <Label class="skilReqModIconText" text="Eng/Science" textWrap="true"/>
                            </StackLayout>
                            <StackLayout class="" v-if="medical">
                                <Label class="fas skilReqModIcon" :text="'fa-stethoscope' | fonticon" color="#55a3bb"/>
                                <Label class="skilReqModIconText" text="Medicine" textWrap="true"/>
                            </StackLayout>
                            <StackLayout class="" v-if="corporate">
                                <Label class="fas skilReqModIcon" :text="'fa-briefcase' | fonticon" color="#d16a6e"/>
                                <Label class="skilReqModIconText" text="Corporate" textWrap="true"/>
                            </StackLayout>
                        </FlexboxLayout>

                        <!-- Post Content **Limit to 100 characters - <50 words** -->
                        <Label text="Need Help With: " class="titleText" style="text-align:center;" fontWeight="bold" textDecoration="underline"/>
                        <StackLayout class="textFieldBord">
                            <Label :text="post_content" class="fieldText" textWrap="true"/>
                        </StackLayout>

                </StackLayout>

                <!-- Make Contact -->
                <StackLayout row="2" col="0" horizontalAlignment="center" verticalAlignment="center" class="" @tap="sendEmail">
                    <Label :text="'fa-paper-plane' | fonticon" class="fas labelCent plane"/>
                    <Label class="planeLabel" text="Make Contact"/>
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
    props: ["_id","profpic","userposting","post_title","post_content","eng_sci","medical","corporate","time_add","seen"
    , "no_seen","email"],
    data: function () {
      return {
          _id: this._id,
          profpic: this.profpic,
          userposting: this.userposting,
          post_title: this.post_title,
          post_content: this.post_content,
          eng_sci: this.eng_sci,
          medical: this.medical,
          corporate: this.corporate,
          time_add: this.time_add,
          seen: this.seen,
          no_seen: this.no_seen,
          email:this.email,


          //active user data
          activeUserName: "",
          activeUserEmail:""

      }
    },
    methods: {
        sendEmail() {
        
        //connect with Kinvey
            
        var vm = this;
            
        var client = Kinvey.init({
            appKey: "kid_S1Gok7ARr",
            appSecret: "430e2c4f39c240e6970bd5683bf9cc09"
        });
        
        // get name & username(email) of active user and store locally
      

        const user_fn = Kinvey.User.getActiveUser(client).data.first_name;
        const user_ln = Kinvey.User.getActiveUser(client).data.last_name;
        this.activeUserName = user_fn + " " + user_ln;
        this.activeUserEmail = Kinvey.User.getActiveUser(client).username;

        console.log("send email to:"+this.email)

        // send email

        email.compose({
        subject: "Perth Biodesign Alumni Query about: "+ vm.post_title +" from: " + vm.activeUserName,
        body: "",
        to: ["addemail@hotmail.com"],
        cc: [],
        bcc: [],
        attachments:"",
        }).then(
            function() {
            console.log("Successfully sent email to Alumni");
            }, function(err) {
            console.log("Error in email plugin: " + err);
            });
        }
    }
};
</script>

<style scoped>

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
    margin-left: 10;
    margin-right: 10;
    margin-bottom: 5;
}

.skilReqYes{
    text-align: center;
    color:#A5D6A7;
    font-size: 20;
}
.skilReqNo{
    text-align: center;
    color:#EF9A9A;
    font-size: 20;
}


.borderTesting{
    border-color:#073267; 
	border-width: 1;
}

.plane{
    color: #073267;
    font-size: 35;
    margin-top: 10;
    
}

.planeLabel{
    margin-bottom: 10;
    text-align: center;
	font-size: 14;
    color:#000;
}

.titleText {
    font-size: 19;
    text-align: center;
    margin-bottom: 5;
    margin-top: 5;
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

</style>

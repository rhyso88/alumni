<template>
  <Page>
      <Gridlayout rows="auto, auto, auto, auto" columns="*,*,*">
        <!-- Portrait Photo & Name -->
              <StackLayout row="0" col="0" colSpan="3" horizontalAlignment="center" verticalAlignment="center">
                <Image :src="src" stretch="aspectFill" class="profilePic"></Image>
                <Label :text="name" color="#000" fontSize="19" fontWeight="bold" class="labelCent"/>
              </StackLayout>
        <!-- Information about Alumni -->

              <Stacklayout row="1" col="0" colSpan="3" horizontalAlignment="center" class="aboutContainer">
                <Stacklayout>
                  <Gridlayout rows="auto" columns="2*,3*">
                      <Label row="0" col="0" text="Occupation: " fontWeight="bold" horizontalAlignment="right"/>
                      <Label row="0" col="1" :text="occupation" textWrap="true" class="labelLeftDist"/>
                  </Gridlayout>
                </Stacklayout>
                <Stacklayout>
                   <Gridlayout rows="auto" columns="2*,3*">
                      <Label row="0" col="0" text="Qualifications: " fontWeight="bold" horizontalAlignment="right"/>
                      <Label row="0" col="1" :text="qualification" textWrap="true" class="labelLeftDist"/>
                   </Gridlayout>
                </Stacklayout>
                <Stacklayout>
                  <Gridlayout rows="auto" columns="2*,3*">
                     <Label row="0" col="0" text="Workplace: " fontWeight="bold" horizontalAlignment="right"/>
                     <Label row="0" col="1" :text="workplace" textWrap="true" class="labelLeftDist"/>
                  </Gridlayout>
                </Stacklayout>
                <Stacklayout>
                  <Gridlayout rows="auto" columns="2*,3*">
                    <Label row="0" col="0" text="Interest: " fontWeight="bold" horizontalAlignment="right"/>
                    <Label row="0" col="1" :text="interest" textWrap="true" class="labelLeftDist"/>
                  </Gridlayout>
                </Stacklayout>
              </Stacklayout>

        <!-- Skillset -->

              <Stacklayout row="2" col="0" colSpan="3" horizontalAlignment="center" verticalAlignment="center" orientation="horizontal">
                  <StackLayout>
                      <Label class="fas modIcon" :text="'fa-tools' | fonticon" color="#53beb1" v-if="eng_sci"/>
                      <Label class="modSkilText" text="Eng/Science" v-if="eng_sci" textWrap="true"/>
                  </StackLayout>
                  <StackLayout>
                      <Label class="fas modIcon" :text="'fa-stethoscope' | fonticon" color="#d16a6e" v-if="medical"/>
                      <Label class="modSkilText" text="Medicine" v-if="medical" textWrap="true"/>
                  </StackLayout>
                  <StackLayout>
                      <Label class="fas modIcon" :text="'fa-briefcase' | fonticon" color="#55a3bb" v-if="corporate"/>
                      <Label class="modSkilText" text="Corporate" v-if="corporate" textWrap="true"/>
                  </StackLayout>
              </Stacklayout>

        <!-- Contact -->

              <StackLayout row="3" col="0" colSpan="3" horizontalAlignment="center" verticalAlignment="center">
                <Button class="fas sendEmailIcon" @tap="sendEmail" :text="'fa-paper-plane' | fonticon" />
                <Label class="modSkilText" @tap="sendEmail" text="Send Query"/>
              </StackLayout>     
    </Gridlayout>
  </Page>
</template>

<script>
var email = require("nativescript-email");
import * as Kinvey from "kinvey-nativescript-sdk";
var dialogs = require("tns-core-modules/ui/dialogs");

export default {
    props: ["name", "occupation", "src", "eng_sci", "medical", "corporate","qualification","interest","workplace","email"],
    data: function () {
      return {
        name: this.name,
        occupation:this.occupation,
        src:this.src,
        eng_sci:this.eng_sci,
        medical:this.medical,
        corporate:this.corporate,
        workplace:this.workplace,
        interest:this.interest,
        qualification:this.qualification,
        email:this.email,
        activeUserName:"",

        isBold: true
      }
    },
    methods: {
      /*
        emailSend() {
        console.log("Send an email to"+this.email)
        },
      */
      /*
        emailCheck() {
        email.available().then(function(avail) {
        console.log("Email available? " + avail);
        })
        },
      */
     sendEmail() {

      var vm = this;

      var client = Kinvey.init({
      appKey: "kid_S1Gok7ARr",
      appSecret: "430e2c4f39c240e6970bd5683bf9cc09"
      });

      /*

      const activeUser = Kinvey.User.getActiveUser(client).username;
      const activeName = Kinvey.User.getActiveUser(client)._id;
      this.activeAlumni = activeUser;
      console.log("The current active user is: " + activeUser);
      console.log("The current active _id is: " + activeName);

      */

      const user_fn = Kinvey.User.getActiveUser(client).data.first_name;
      const user_ln = Kinvey.User.getActiveUser(client).data.last_name;
      this.activeUserName = user_fn + " " + user_ln;
      // console.log("Send to :" + this.activeUserName)

      //  **** ### console.log("Kinvey Users Object: "+ JSON.stringify(usersKinvey)); **** ###
      // *** ### DONT DELETE ABOVE  - JSOn.stringify(Object object) - really helpful for debugging *** ###

      email.compose({
      subject: "Perth Biodesign Alumni Query from: "+ vm.activeUserName,
      body: "",
      to: [this.email],
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

<style>
</style>

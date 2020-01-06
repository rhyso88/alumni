<template>
  <Page>
    <Stacklayout>
      <Label text="name" color="#000" fontSize="19" fontWeight="bold"/>
    </Stacklayout>
  </Page>
</template>

<script>
var email = require("nativescript-email");
import * as Kinvey from "kinvey-nativescript-sdk";
var dialogs = require("tns-core-modules/ui/dialogs");

export default {
    props: ["user"],
    data: function () {
      return {
        user: this.user
      }
    },
    methods: {
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

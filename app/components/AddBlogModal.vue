<template>
  <Page>
    <StackLayout class="borderTesting" height="100%" >
        <!-- Portrait Photo & Name -->

        <StackLayout height="30%" horizontalAlignment="center" verticalAlignment="center" class="">
            <Image :src="profpic" stretch="aspectFill" class="profilePic" ></Image>
            <Label :text="userposting" color="#000" fontSize="19" fontWeight="bold" class="labelCent"/>
        </StackLayout>

        <!-- Information about Alumni -->
        <StackLayout height="60%" width="100%" class="" horizontalAlignment="center" verticalAlignment="center" >
            <GridLayout rows="*,*,2*" columns="auto,*" class="">
                <!-- Post Title **Limit to 15 characters ** -->
                <Label row="0" col="0" text="Post Title: " class="leftColText" style="text-align:right;" fontWeight="bold"/>
                <StackLayout row="0" col="1" class="textFieldBord">
                    <TextField v-model="post_title" hint="Enter post title <15 characters..." height="90%" width="95%" 
                    class="fieldText" textWrap="true"/>
                </StackLayout>
                <!-- Post Skills Required -->
                <Label row="1" col="0" text="Skills Required: " class="leftColText" style="text-align:right;" fontWeight="bold"/>
                <FlexboxLayout row="1" col="1" height="100%" class="textFieldBord" alignItems="center" justifyContent="center">
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
                        <Label class="fas skilReqYes" :text="'fa-check-circle' | fonticon"  v-if="corporate"/> 
                        <Label class="fas skilReqNo" :text="'fa-times-circle' | fonticon"  v-else />
                    </StackLayout>
                </FlexboxLayout>

                <!-- Post Content **Limit to 100 characters - <50 words** -->
                <Label row="2" col="0" text="Post Title: " class="leftColText" style="text-align:right;" fontWeight="bold"/>
                <StackLayout row="2" col="1" class="textFieldBord">
                    <TextField row="2" col="1" v-model="post_content" height="95%" width="95%" hint="Enter a short query <100 characters long that
                        you require help with..." class="fieldText" textWrap="true"/>
                </StackLayout>
            </GridLayout>
        </StackLayout>

        <!-- Submit Post -->
        <StackLayout height="10%" horizontalAlignment="center" verticalAlignment="center" class="">
            <Label :text="'fa-pencil-alt' | fonticon" class="fas labelCent pencil"/>
            <Label class="skilReqModIconText" text="Submit Post"/>
        </StackLayout>

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
          time_add:"",
          seen: false,
          no_seen:"0",
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

    }
};
</script>

<style scoped>

.skilBoxMargin{
    /*Turn on borders to see these boxes like you would do in debugging CSS*/
    margin-left: 20;
    margin-right: 20;
}

.skilReqModIcon{
	text-align: center;
    font-size: 25;
    margin-left: 10;
    margin-right: 10;
}

.skilReqModIconText{
	text-align: center;
	font-size: 10;
    color:#000;
    margin-left: 10;
    margin-right: 10;
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

.pencil{
    color: #073267;
    font-size: 30;
}

.leftColText {
    font-size: 15;
}

.fieldText {
    font-size: 15;
}

.textFieldBord {
    border-color:#073267; 
    border-width: 1;
    border-radius:15;
}

</style>

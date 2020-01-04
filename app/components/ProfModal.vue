<template>
  <Page>
      <Gridlayout rows="auto, auto, auto, *" columns="*,*,*">
              <StackLayout row="0" col="0" colSpan="3">
                <Image :src="src" stretch="aspectFill" class="profilePic"></Image>
                <Label :text="name" color="#000" fontSize="19" fontWeight="bold" class="labelCent"/>
              </StackLayout>
              <Gridlayout row="1" col="0" colSpan="3" rows="auto,auto,auto,auto" columns="*,*" class="aboutContainer">
                      <!-- Occupation -->
                      <Label row="0" col="0" text="Occupation: " style="font-size:16;color:#000;"/>
                      <Label row="0" col="1" :text="occupation" style="font-size:16;color:#000;" textWrap="true"/>
                      <!-- Qualifications -->
                      <Label row="1" col="0" text="Qualifications: " style="font-size:16;color:#000;"/>
                      <Label row="1" col="1" :text="qualification" style="font-size:16;color:#000;" textWrap="true"/>
                      <!-- Workplace -->
                      <Label row="2" col="0" text="Workplace: " style="font-size:16;color:#000;"/>
                      <Label row="2" col="1" :text="workplace" style="font-size:16;color:#000;" textWrap="true"/>
                      <!-- Interest -->
                      <Label row="3" col="0" text="Interest: " style="font-size:16;color:#000;"/>
                      <Label row="3" col="1" :text="interest" style="font-size:16;color:#000;" textWrap="true"/>
              </Gridlayout>
                <FlexboxLayout row="2" col="0" colSpan="3"  justifyContent="center">
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
                </FlexboxLayout>
                <Button row="3" col="0" colSpan="3" class="fas sendEmailIcon" @tap="emailSend()" :text="'fa-paper-plane' | fonticon" />
    </Gridlayout>
  </Page>
</template>

<script>
export default {
    props: ["name", "occupation", "src", "eng_sci", "medical", "corporate","qualification","interest","workplace"],
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
        qualification:this.qualification
      }
    },
    methods: {
      emailSend() {
      console.log("Send an email to"+this.name)
    } 
  },
    computed: {
    iconColWhite() {
      return component => ({
        fas: true,
        skillIcons: true,
        whiteSkill: component === false
      });
    },
  }
};
</script>

<style>
</style>

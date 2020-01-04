  <template>
  <Page>
    <DockLayout>
      <StackLayout dock="top" height="90%" width="100%" style>
        <ScrollView>
          <StackLayout style="font-size:18;">
            <StackLayout alignItems="center">
                <Image :src="src" stretch="aspectFill" class="profilePic"></Image>
                <Label :text="name" color="#000" fontSize="19" fontWeight="bold" textAlignment="center"/>
                <StackLayout class="aboutContainer">
                        <StackLayout orientation="horizontal">
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
  </template>
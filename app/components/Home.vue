<template>
  <Page>
    <ActionBar title="Home1 APP"></ActionBar>

    <StackLayout>
      <Label class="body m-20" :text="message" textWrap="true"></Label>
      <Label class="body m-20" :text="message2" textWrap="true"></Label>
      <Label class="body m-20" :text="message3" textWrap="true"></Label>
      <Button class="btn btn-primary" text="Log out" @tap="logout"></Button>
    </StackLayout>
  </Page>
</template>

<script>
import Login from "./Login";
//import datasync from "../services/data-sync";
import datasync2 from "../services/data-sync2";
//datasync();
datasync2();

//retrieve data from Kinvey

//rest of Vue code

export default {
  data() {
    return {
      message: "Yocation functionality.",
      message2: "test2",
      message3: "final"
    };
  },
  methods: {
    logout() {
      this.$backendService.logout();
      this.$navigateTo(Login, {
        clearHistory: true
      });
    }
  }
};
</script>

<style>
</style>

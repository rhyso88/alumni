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

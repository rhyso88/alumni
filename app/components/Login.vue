<template>
    <Page backgroundSpanUnderStatusBar="true" actionBarHidden="true" @loaded="pageLoaded">
        <StackLayout height="100%" width="100%">

             <!--Loading Stage - show this -->

            <Gridlayout rows="*" columns="*" v-show="transitionWait" class="borderTest">
                <Image col="0" row="0" ref="waiting" src="~/assets/login_image/BD_reg_stacked.png" class="intro" height="100"
                    stretch="aspectFit" horizontalAlignment="center" verticalAlignment="center"/>
            </Gridlayout>

            <!-- Otherwise show main page below - Gridlayout wrapped to vertically center same as loading graphic -->
            
            <GridLayout rows="*" columns="*" class="form" ref="mainLogin" v-show="!transitionWait">
                <StackLayout row="0" col="0" class="form"  verticalAlignment="center">
                    <Image class="logo" src="~/assets/login_image/BD_reg_stacked.png" stretch="aspectFit" height="200"></Image>
                    <Label class="header" text="Alumni Login"></Label>

                    <PreviousNextView> <!--  this line purely for keyboard next view plugin -->

                    <GridLayout rows="auto, auto, auto">
                        <StackLayout row="0" class="input-field" @tap="dismissKeyboard">
                            <TextField class="input" hint="Email" :isEnabled="!processing"
                                keyboardType="email" autocorrect="false" ref="username" width="250"
                                autocapitalizationType="none" v-model="user.email"
                                returnKeyType="next" @returnPress="focusPassword"></TextField>
                        </StackLayout>
                        
                        <StackLayout row="1" class="input-field" @tap="dismissKeyboard">
                            <TextField class="input" ref="password" :isEnabled="!processing"
                                hint="Password" secure="true" v-model="user.password" width="250"
                                returnKeyType="next"
                                @returnPress="focusConfirmPassword" horizontalAlignment="center"></TextField>
                        </StackLayout>

                        <ActivityIndicator rowSpan="3" :busy="processing"></ActivityIndicator>
                    </GridLayout>

                    </PreviousNextView> <!--  this line purely for keyboard next view plugin -->

                    <Button text="Log In" :isEnabled="!processing" @tap="submit" class="btn btn-primary m-t-20"></Button>
                    <Label text="Forgot your password?" class="login-label" @tap="forgotPassword()" horizontalAlignment="center"></Label>
                </StackLayout>
            </GridLayout>
        </StackLayout>
    </Page>
</template>

<script>
    import Home from "./Home";
    import Login from "./Login";

    //required to color android status bar
    import * as app from 'tns-core-modules/application'
    import * as platform from 'tns-core-modules/platform'
    import * as color from 'tns-core-modules/color'
    import * as page from 'ui/page'

    export default {
        data() {
            return {
                transitionWait: false,
                processing: false,
                user: {
                    email: "",
                    password: "",
                }
            };
        },
        methods: {
            pageLoaded() {
                if (app.android && platform.device.sdkVersion >= "21") {
                    const window = app.android.foregroundActivity.getWindow();
                    window.setStatusBarColor(new color.Color("#FFFFFF").android);
                }
            },
            dismissKeyboard() {
                this.$refs.username.nativeView.dismissSoftInput()
                this.$refs.password.nativeView.dismissSoftInput()
            },

            submit() {
                if (!this.user.email || !this.user.password) {
                    this.alert(
                        "Please provide both an email address and password."
                    );
                    return;
                }

                this.processing = true;
                this.login2();
            },

            login2() {
                let element = this.$refs.mainLogin.nativeView
                var vm = this
                element.animate({ opacity: 0, duration:500})
                    .then(function () { return vm.transitionWait = true; })
                    .then(function () { return vm.login(); })
                    .catch(function (e) {console.log("login2 error :"+ e.message);});
            },

            login() {
                var vm = this
                this.$backendService
                    .login(this.user)
                    .then(() => {
                        this.processing = false;
                        this.$navigateTo(Home, { clearHistory: true, 
                        transition: {
                            name:'fade',
                            duration: 500
                            }
                        });
                    })
                    .catch(() => {
                        vm.transitionWait = false;
                        vm.processing = false;
                        this.alert(
                            "Unfortunately we could not find your account."
                        );
                        this.$navigateTo(Login, { clearHistory: true, 
                        });
                    });
            },

            forgotPassword() {
                prompt({
                    title: "Forgot Password",
                    message: "Enter the email address (your username) linked to your account",
                    inputType: "email",
                    defaultText: "",
                    okButtonText: "Ok",
                    cancelButtonText: "Cancel"
                }).then(data => {
                    if (data.result) {
                        this.$backendService
                            .resetPassword(data.text.trim())
                            .then(() => {
                                this.alert(
                                    "Your password was successfully reset. Please check your email for instructions on choosing a new password."
                                );
                            })
                            .catch(() => {
                                this.alert(
                                    "Unfortunately, an error occurred resetting your password."
                                );
                            });
                    }
                });
            },

            focusPassword() {
                this.$refs.password.nativeView.focus();
            },

            alert(message) {
                return alert({
                    title: "APP NAME",
                    okButtonText: "OK",
                    message: message
                });
            }
        }
    };
</script>

<style scoped>
    .form {
        margin-left: 30;
        margin-right: 30;
    }

    .logo {
        margin-bottom: 12;
        font-weight: bold;
    }

    .header {
        font-size: 25;
        font-weight: 600;
        margin-bottom: 70;
        text-align: center;
        color:#073267; 
    }

    .input-field {
        margin-bottom: 25;
    }

    .input {
        font-size: 18;
    }

    .input:disabled {
        background-color: white;
        opacity: 0.5;
    }

    .btn-primary {
        margin: 30 5 15 5;
        z-index:0; /* Removes shadow around android buttons */
    }

    .login-label {
        color: #A8A8A8;
        font-size: 16;
    }

</style>

<template>
    <Page backgroundSpanUnderStatusBar="true" actionBarHidden="true" class="page-layout" @loaded="pageLoaded">
        <StackLayout height="100%" width="100%">

             <!--Loading Stage - show this -->

            <Gridlayout rows="*" columns="*" v-show="transitionWait" class="borderTest">
                <Image col="0" row="0" ref="waiting" src="~/assets/login_image/BD_reg_stacked.png" class="intro" height="100"
                    stretch="aspectFit" horizontalAlignment="center" verticalAlignment="center"/>
            </Gridlayout>

            <!-- Otherwise show main page below - Gridlayout wrapped to vertically center same as loading graphic -->
            
            <GridLayout rows="*" columns="*">
                <StackLayout row="0" col="0" class="form anim-fade-in" ref="mainLogin" v-show="!transitionWait" verticalAlignment="center">
                    <Image class="logo" src="~/assets/login_image/BD_reg_stacked.png" stretch="aspectFit" height="200"></Image>
                    <Label class="header" text="Alumni Login"></Label>

                    <GridLayout rows="auto, auto, auto">
                        <StackLayout row="0" class="input-field" @tap="dismissKeyboard">
                            <TextField class="input" hint="Email" :isEnabled="!processing"
                                keyboardType="email" autocorrect="false" ref="username" width="250"
                                autocapitalizationType="none" v-model="user.email"
                                returnKeyType="next" @returnPress="focusPassword"></TextField>
                            <StackLayout class="hr-light"></StackLayout>
                        </StackLayout>

                        <StackLayout row="1" class="input-field" @tap="dismissKeyboard">
                            <TextField class="input" ref="password" :isEnabled="!processing"
                                hint="Password" secure="true" v-model="user.password" width="250"
                                :returnKeyType="isLoggingIn ? 'done' : 'next'"
                                @returnPress="focusConfirmPassword" horizontalAlignment="center"></TextField>
                            <StackLayout class="hr-light"></StackLayout>
                        </StackLayout>

                        <StackLayout row="2" v-show="!isLoggingIn" class="input-field">
                            <TextField class="input" ref="confirmPassword" :isEnabled="!processing"
                                hint="Confirm password" secure="true" v-model="user.confirmPassword"
                                returnKeyType="done" horizontalAlignment="center"></TextField>
                            <StackLayout class="hr-light"></StackLayout>
                        </StackLayout>

                        <ActivityIndicator rowSpan="3" :busy="processing"></ActivityIndicator>
                    </GridLayout>

                    <Button :text="isLoggingIn ? 'Log In' : 'Sign Up'" :isEnabled="!processing"
                        @tap="submit" class="btn btn-primary m-t-20"></Button>
                    <Label *v-show="isLoggingIn" text="Forgot your password?"
                        class="login-label" @tap="forgotPassword()" horizontalAlignment="center"></Label>
                </StackLayout>
            </GridLayout>
        </StackLayout>
    </Page>
</template>

<script>
    import Home from "./Home";

    //required to color android status bar
    import * as app from 'tns-core-modules/application'
    import * as platform from 'tns-core-modules/platform'
    import * as color from 'tns-core-modules/color'
    import * as page from 'ui/page'

    export default {
        data() {
            return {
                transitionWait: false,
                isLoggingIn: true,
                processing: false,
                user: {
                    email: "rhyso88@hotmail.com",
                    password: "testing",
                    confirmPassword: "testing"
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
            toggleForm() {
                this.isLoggingIn = !this.isLoggingIn;
            },

            submit() {
                if (!this.user.email || !this.user.password) {
                    this.alert(
                        "Please provide both an email address and password."
                    );
                    return;
                }

                this.processing = true;
                if (this.isLoggingIn) {
                    this.login2();
                } else {
                    this.register();
                }
            },

            login2() {
                let element = this.$refs.mainLogin.nativeView
                var vm = this
                element.animate({ opacity: 0, duration:300})
                    .then(function () { return vm.transitionWait = true; })
                    .then(function () { return vm.login(); })
                    .catch(function (e) {console.log("login2 error :"+ e.message);});
            },

            login() {
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
                        this.processing = false;
                        this.alert(
                            "Unfortunately we could not find your account."
                        );
                    });
            },

            register() {
                if (this.user.password != this.user.confirmPassword) {
                    this.alert("Your passwords do not match.");
                    this.processing = false;
                    return;
                }

                this.$backendService
                    .register(this.user)
                    .then(() => {
                        this.processing = false;
                        this.alert(
                            "Your account was successfully created.");
                        this.isLoggingIn = true;
                    })
                    .catch(() => {
                        this.processing = false;
                        this.alert(
                            "Unfortunately we were unable to create your account."
                        );
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
            focusConfirmPassword() {
                if (!this.isLoggingIn) {
                    this.$refs.confirmPassword.nativeView.focus();
                }
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

    .sign-up-label {
        margin-bottom: 20;
    }

    .bold {
        color: #000000;
    }

    /* Below for sorting out splash screen to login page transition */

    
    .page-layout {
        background-color: #ffffff;
        animation-name: intro-background-intro;
        animation-duration: 6;
        animation-fill-mode: forwards;
        animation-iteration-count: 1;
        animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
    }

    @keyframes intro-background-intro {
        0% {        
            background-color: white;
        }
        20%{
            background-color: white;
        }
        100% {
            background-color: white;
        }
    }

    .borderTest {
        border-color:#000;
	    border-width: 1;
    }
    

    .anim-fade-in{    
        animation-name: intro-element-intro;
        animation-duration: 2;
        animation-fill-mode: forwards;
        animation-iteration-count: 1;
        animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);    
    
    }
    @keyframes intro-element-intro {
        0% {
            opacity:0;
            transform: translate(0, 1000);
            animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        100% {
            opacity:1;
            animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1); 
            transform: translate(0, 0) ;        
        }
    }

</style>

import * as Kinvey from "kinvey-nativescript-sdk";

//initialise and check Kinvey connection

/*

Kinvey.init({
    appKey: "kid_S1Gok7ARr",
    appSecret: "430e2c4f39c240e6970bd5683bf9cc09"
});

Kinvey.ping()
    .then(function (response) {
        console.log(
            '$$$$$$$$$$ datasync2 initialisation'
            + response.version + ', response: ' + response.kinvey);
    })
    .catch(function (error) {
        console.log('datasync2 Kinvey Ping Failed. Response: ' + error.description);
    });


*/

//access collection data and store locally

/*

##this one works using code I found online##

var datasync2 = function () {

    //check active user logged in before accessing data
    const activeUser = Kinvey.User.getActiveUser();
    if(activeUser == null) {console.log("active user is null")}
    else {console.log("active user is true")}

    //access data

    const dataStore = Kinvey.DataStore.collection("names");
    const stream = dataStore.find();

    stream.subscribe(
        (employees) => {
            console.log('$$$$$$$$ datasync2 inside stream loop datasync2');
            employees.forEach((employee) => {
                console.log(employee)
                console.log("inside steram loop $$$ datasync 2")
            });
        },
        (error) => {
            console.log(error);
        },
        () => {
            console.log("Finished collecting data");
        }
    );
}
*/

/*

##this one works using official Kinvey code - however changed to fat arrow functions and use const##

var datasync2 = function () {

    //check active user logged in before accessing data

    const activeUser = Kinvey.User.getActiveUser();
    if (activeUser == null) { console.log("active user is null") }
    else { console.log("active user is true") }

    //collect data from Kinvey 

    const dataStore = Kinvey.DataStore.collection("names");
    const stream = dataStore.find();

    stream.subscribe(
        (employees) => {
            employees.forEach((element) => {
                console.log(element)
            });
        }, (error) => {
            console.log("error found in datasync2" + error);
        }, () => {
            console.log("accessed a record");
        }
    );
}
*/

/*

##this one works dumping in a local array 

var datasync2 = function () {

    //check active user logged in before accessing data

    const activeUser = Kinvey.User.getActiveUser();
    if (activeUser == null) { console.log("active user is null") }
    else { console.log("active user is true") }

    //collect data from Kinvey 

    const dataStore = Kinvey.DataStore.collection("names");
    const stream = dataStore.find();

    //true using object literal and return object which can be accessed 

    var localdata = [];

    stream.subscribe(
        (employees) => {
            employees.forEach((element) => {
                //console.log(({element}));
                localdata.push(element);
            });
        }, (error) => {
            console.log("error found in datasync2" + error);
        }, () => {
            //console.log("accessed a record");
            console.log(localdata);
        }
    );
}

*/

//This one works. But I cant access the "this" localdata array to store the return values

/* var datasync2 = function () {

    //collect data from Kinvey 

    const dataStore = Kinvey.DataStore.collection("names");
    const stream = dataStore.find();

    //true using object literal and return object which can be accessed 

    var localdata = [];

    stream.subscribe(
        (employees) => {
            employees.forEach((element) => {
                localdata.push(element);
            });
        }, (error) => {
            console.log("error found in datasync2" + error);
        },
        () => {
            console.log(localdata);
        }
    );
}

export default datasync2;

*/
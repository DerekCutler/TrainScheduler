// Steps to complete:

// 1. Initialize Firebase

// 2. Create button for adding new trains - then update the html + update the database

// 3. Create a way to retrieve trains from the train database.

// 4. Create a way to calculate. Using difference between next train and current time.



// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyDKWpaQLRw32-L-Dd3oZ66L9DV2tpoJ7OQ",
  authDomain: "train-schedule-316e5.firebaseapp.com",
  databaseURL: "https://train-schedule-316e5.firebaseio.com",
  projectId: "train-schedule-316e5",
  storageBucket: "train-schedule-316e5.appspot.com",
  messagingSenderId: "1093278737387"
};
firebase.initializeApp(config);

let database = firebase.database();

// 2. Create button for adding new trains - then update the html + update the database
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();
  // alert("click");

  // User input fields
  let trainNameInput = $("#train-name-input").val().trim();
  let destinationInput = $("#destination-input").val().trim();
  let startTimeInput = $("#start-time-input").val().trim();//, "hh:mm").format("X");
  let frequencyInput = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newTrain = {
    name: trainNameInput,
    destination: destinationInput,
    startTime: startTimeInput,
    frequency: frequencyInput,
  };

  // Uploads train data to the database
  //  alert("DB Push")

  database.ref().push(newTrain);

  // Logs Train info to console
  // console.log(newTrain.name);
  // console.log(newTrain.destination);
  // console.log(newTrain.startTime);
  // console.log(newTrain.frequency);

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-time-input").val("");
  $("#frequency-input").val("");

});

// 3. Create a way to retrieve trains from the train database.

database.ref().on("child_added", function (childSnapshot) {
  // alert(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStartTime = childSnapshot.val().startTime;
  var trainFrequency = childSnapshot.val().frequency;

  // alert("You added the train " + trainName + " heading to " + trainDestination + ".  This train first ran at " + trainStartTime + " and it arrives every " + trainFrequency + " minutes.");

  // Calculations

  // trainStartTime = "4:20"
  // currentTime = "4:32"

  // if // the currentTime is later than the trainStartTime

    // result = currentTime - trainStartTime = // 12

    // diff = result % freq; // 0

    // nextTrainTime = currentTime + diff

  // else {

  // }

//
var currentTime = moment();
// moment().hour(Number).minute(Number)
var timeSplitArray = trainStartTime.split(":");
var hour = timeSplitArray[0];
var minute = timeSplitArray[1];

// Creating a new moment date object, and immediately set the hour and minute.
trainStartTime = moment().hour(hour).minute(minute);

let formattedNextTrainTime = '';
let formattedMinutesAway = '';

 // Math for Next Arrival 
if (currentTime.isAfter(trainStartTime, 'minutes')) {
  // var timeDiffMilliseconds = currentTime.diff(trainStartTime, "minutes"); // Returns the difference in miliseconds.
  var timeDiffMinutes = currentTime.diff(trainStartTime, "minutes"); // Returns the difference in miliseconds.
  // var timeDiffMinutes = timeDiffMilliseconds / 60000; 
  // var trainFrequencyMiliseconds = trainFrequency * 60000;
  var remainderDiffMinutes = ( timeDiffMinutes % trainFrequency );
  // var remainderDiffMiliseconds = ( timeDiffMilliseconds % trainFrequencyMiliseconds );
  // var remainderDiffMiliseconds = ( timeDiffMilliseconds % trainFrequencyMiliseconds );

  // let minutesToAdd = Math.floor(remainderDiffMiliseconds / 60000);
  // let minutesToAdd = Math.ceil(remainderDiffMiliseconds / 60000);

  currentTime = currentTime.add(remainderDiffMinutes, "minutes");

  formattedNextTrainTime = currentTime.format('h:mm A');
  formattedMinutesAway = remainderDiffMinutes;



  // var timeDiffMinutes = currentTime.diff(trainStartTime, "minutes"); // Returns the difference in miliseconds.
  // var remainderDiffMinutes = ( timeDiffMinutes % trainFrequency );
  // currentTime = currentTime.add(remainderDiffMinutes, "minutes");

  // formattedNextTrainTime = currentTime.format('h:mm A');
  // formattedMinutesAway = remainderDiffMinutes;

}
else if(currentTime.isBefore(trainStartTime, 'minutes')) {
  // todo: if time is before
}
else {
  // todo: is the same time. in which case you simply return the current time.
  trainStartTime = moment().hour(hour).minute(minute);
  formattedNextTrainTime = trainStartTime.format('h:m A');
  formattedMinutesAway = 0;
}

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(formattedNextTrainTime),
    $("<td>").text(formattedMinutesAway),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});









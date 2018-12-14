// Steps to complete:

// 1. Initialize Firebase

// 2. Create button for adding new trains - then update the html + update the database

// 3. Create a way to retrieve trains from the train database.

// 4. Create a way to calculate. Using difference between next train and current time.



// 1. Initialize Firebase
let config = {
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
  let newTrain = {
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
  let trainName = childSnapshot.val().name;
  let trainDestination = childSnapshot.val().destination;
  let trainStartTime = childSnapshot.val().startTime;
  let trainFrequency = childSnapshot.val().frequency;

  // alert("You added the train " + trainName + " heading to " + trainDestination + ".  This train first ran at " + trainStartTime + " and it arrives every " + trainFrequency + " minutes.");

  // Calculations
// JARED
  let currentTime = moment();
  let timeSplitArray = trainStartTime.split(":");
  let hour = timeSplitArray[0];
  let minute = timeSplitArray[1];
  
  // Creating a new moment date object, and immediately set the hour and minute.
  trainStartTime = moment().hour(hour).minute(minute);
  
  let formattedNextTrainTime = '';
  let formattedMinutesAway = '';
  
  // Calculate next arrival time and minutes away.
  if (currentTime.isAfter(trainStartTime, 'minutes')) {
      while(currentTime.isAfter(trainStartTime)) {
          trainStartTime.add(trainFrequency, 'minutes');
      }
  
      formattedNextTrainTime = trainStartTime.format('h:mm A');
      formattedMinutesAway = trainStartTime.diff(currentTime, 'minutes');
  }
  else if(currentTime.isSameOrBefore(trainStartTime, 'minutes')) {
      formattedNextTrainTime = trainStartTime.format('h:mm A');
      formattedMinutesAway = trainStartTime.diff(currentTime, 'minutes');
  }
  
  console.log('Next Arrival: ' + formattedNextTrainTime);
  console.log('Minutes Away: ' + formattedMinutesAway)
// JARED

//ONE MORE BACK



  // Create the new row
  let newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(formattedNextTrainTime),
    $("<td>").text(formattedMinutesAway),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});









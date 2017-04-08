    var config = {
        apiKey: "AIzaSyDbnEhGGMfA4WM2BrsZGfme2PeMM3xCBPA",
        authDomain: "train-schedule-6c049.firebaseapp.com",
        databaseURL: "https://train-schedule-6c049.firebaseio.com",
        projectId: "train-schedule-6c049",
        storageBucket: "train-schedule-6c049.appspot.com",
        messagingSenderId: "865659078356"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    $('#submitForm').on('click', function() {
        event.preventDefault();

        var trainName = $('#name').val().trim();
        var destination = $('#destination').val().trim();
        var frequency = $('#frequency').val().trim();
        var firstTrain = $('#firstTrain').val().trim();

        var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
        var currentTime = moment();

        var timeDifference = moment().diff(moment(firstTrainConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + timeDifference);

        var tRemainder = timeDifference % frequency;
        console.log(tRemainder);

        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var nextTrainFormatted = moment(nextTrain).format("LT");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


        database.ref().push({
            name: trainName,
            destination: destination,
            frequency: frequency,
            nextTrain: nextTrainFormatted,
            minutesTillNextTrain: tMinutesTillTrain
        })
    });

    database.ref().on("child_added", function(childSnapshot) {
        var tableRow = $('<tr>');
        var trainName = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var frequency = childSnapshot.val().frequency;
        var firstTrain = childSnapshot.val().firstTrain;
        var nextTrain = childSnapshot.val().nextTrain;
        var minutesTillNextTrain = childSnapshot.val().minutesTillNextTrain;

        tableRow.append("<td>" + trainName + "</td>");
        tableRow.append("<td>" + destination + "</td>");
        tableRow.append("<td>" + frequency + "</td>");
        tableRow.append("<td>" + nextTrain + "</td>");
        tableRow.append("<td>" + minutesTillNextTrain + "</td>");

        $('tbody').append(tableRow);
        $("form").trigger("reset");
    })

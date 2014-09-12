var mongoose = require('mongoose');

// The attendee object schema
var attendeeSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	address: String,
	city: String,
	state: String,
	zipcode: String,
	email: String,
	sessions: [{
		name: String,
		date: String,
		completed: Boolean
	}]
	
});

var attendee = mongoose.model('Attendee', attendeeSchema);

var vcap_services = JSON.parse(process.env.VCAP_SERVICES || '{}');
var uri = vcap_services != undefined && vcap_services.mongolab != undefined ? vcap_services.mongolab[0].credentials.uri : 'localhost:27017/cf-workshop-node';

mongoose.connect(uri, function(err, res) {
	if (err) {
		console.log('Error connecting to URI: ' + uri + ". " + err);
	} else {
		console.log('Connected successfully to URI: ' + uri);
	}
});

mongoose.connection.on('open', function() {
   console.log("Connected successfully; testing to see if data needs to be seeded...");
   attendee.find(function(e, attendees, count) {
      if (!attendees || attendees.length < 1) {
          console.log("No data.  Seeding sample data...");
          var newAttendee = new attendee({"firstname": "Brian", "lastname": "Jimerson", "address": "123 Main St.", "city": "Akron", "state": "OH", "zipcode": "44313", "email": "bjimerson@pivotal.io", "sessions": [ { "name": "Session 1", "date": "2014-09-01", "completed": true }, { "name": "Session 2", "date": "2014-08-06", "completed": false}]});
          newAttendee.save(function(err) {
             if (err) console.log("Error saving attendee 1: " + err);
          });
          newAttendee = new attendee({"firstname": "Sally", "lastname": "Struthers", "address": "456 Oak St.", "city": "Akron", "state": "OH", "zipcode": "44313", "email": "sstruthers@gmail.com", "sessions": [ ]});
          newAttendee.save(function(err) {
             if (err) console.log("Error saving attendee 1: " + err);
          });
          newAttendee = new attendee({"firstname": "John", "lastname": "Doe", "address": "1111 Peach St.", "city": "Akron", "state": "OH", "zipcode": "44313", "email": "jdoe@gmail.com", "sessions": [ ]});
          newAttendee.save(function(err) {
             if (err) console.log("Error saving attendee 1: " + err);
          });
      } else {
          console.log("Existing data found.  Not seeding sample data...");
      }
   });
});
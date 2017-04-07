//garage side, use public broker for testing purpose
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

//create a local variable to store state of the door
//the state can be open, closed, and closing
var state = 'closed'

client.on('connect',()=> {
	//subscribe to the topics published by the controller
	client.subscribe('garage/open');
	client.subscribe('garage/close');

	client.publish('garage/connected', 'true');
	sendStateUpdate();
})

client.on('message', (topic, message) => {
	console.log('received message %s %s', topic, message);

	//act according to corresponding message
	switch(topic) {
		case 'garage/open': 
			return handleOpenRequest(message);
		case 'garage/close':
			return handleCloseRequest(message);
	} 
})

function sendStateUpdate() {
	console.log('Sending state %s', state);
	client.publish('garage/state', state);
}

function handleOpenRequest(message) {
	if(state !== 'open' && state !== 'opening')
		console.log('Opening the garage door now!');
		state = 'opening';
		sendStateUpdate();

		setTimeout(() => {
			state = 'open'
			sendStateUpdate();
		}, 2000);
}

function handleCloseRequest(message) {
	if(state !== 'closed' && state !== 'closing') {
		state = closing;
		sendStateUpdate();
		setTimeout(() => {
			state = 'open'
			sendStateUpdate();
		}, 2000);
	}
}
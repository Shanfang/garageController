//controller side 
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

var garageState = ''
var connected = false

client.on('connect', ()=> {
	client.subscribe('garage/connected');
	client.subscribe('garage/state');
})

client.on('message', (topic, message) => {
	switch(topic) {
		case 'garage/connected':
			return handleGarageConnected(message);
		case 'garage/state':
			return handleGarageState(message);
	}

	console.log('Oops, there is no handle for topic %s', topic);
})

function handleGarageConnected(){
	connected = (message.toString() === 'true');
	console.log('Garage connected state is %s', message);
}

function handleGarageState(message) {
	garageState = message;
	console.log('Garage state update to %s', message);
}

function openGarageDoor() {
	if(connected && garageState !== 'open') {
		client.publish('garage/open', 'true');
	}
}

function closeGarageDoor() {
	if(connected && garageState !== 'closed' ) {
		client.publish('garage/close', 'true');
	}
}

setTimeout(() => {
	console.log('Open the door');
	openGarageDoor();
}, 2000)

setTimeout(() => {
	console.log('Close the door');
	closeGarageDoor();
}, 2000)
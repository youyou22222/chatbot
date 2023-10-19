import io from 'socket.io-client';

const socket = io('https://api.cheeseispower.xyz');

socket.on('connect', function() {
    console.log('Successfully connected!');
});

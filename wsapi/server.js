var ws = require('socket.io')(9000);
ws.handle = require('./tablefetch.js');
ws.handle2 = require('./tablefetch2.js');

ws.handle2.us = ws;

ws.on
("connection",
	function (socket)
	{
		socket.emit("update", JSON.stringify({"0": { "a" : 2 }, "1": { "a" : 3 }}));
		ws.handle2.fetchteam(socket);
		ws.handle2.fetchteams(socket);
	}
);

ws.handle.su = ws;
ws.handle.loop();

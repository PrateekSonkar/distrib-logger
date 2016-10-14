var zmq = require('zmq')
var subscriber = zmq.socket('sub')

subscriber.on('message', function() {
  //console.log('received message : '+data + " ===> " + a);
  var msg = [];
    Array.prototype.slice.call(arguments).forEach(function(arg) {
        msg.push(arg.toString());
    });

    console.log(msg);
});

subscriber.connect('tcp://127.0.0.1:5563');
subscriber.connect('tcp://127.0.0.1:5564');
subscriber.connect('tcp://127.0.0.1:5565');

subscriber.subscribe('127.0.0.1-5563');
subscriber.subscribe('127.0.0.1-5564');
subscriber.subscribe('127.0.0.1-5565');
// subscriber.subscribe('A');

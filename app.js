var express= require('express'),
    app= express(),
    server= require('http').createServer(app),
    io= require('socket.io').listen(server);
    usernames= [];
  server.listen(process.env.PORT || 3000);
  console.log('server running');
  app.get('/', function(req, res){
    res.sendFile(__dirname+ '/index.html');
  });

io.sockets.on('connection', function(socket){
      console.log('socket connected');

      socket.on('new user', function(data, callback){
           if(usernames.indexOf(data)!=-1){
              callback(false);
              console.log('name already there');
           }else {
             console.log('name not there');
              callback(true);
              socket.username=data;
              usernames.push(socket.username);
              updateUsernames();
           }
      });

      //update Usernames
      function updateUsernames(){
              console.log('this is updateUsernames()');
              io.sockets.emit('usernames', usernames);
      }

      socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data, name:socket.username});
      });

      //disconnect
      socket.on('disconnect', function(data){
          if(!socket.username){
            return;
          }
          io.sockets.emit('notification', {name:socket.username});
          usernames.splice(usernames.indexOf(socket.username),1);
          updateUsernames();
      });
});

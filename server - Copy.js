const express = require(`express`);
const path = require(`path`);
const app = express();
const server = require(`http`).createServer(app);
const io = require(`socket.io`).listen(server);
const port = process.env.PORT || 3000;


var users = [];
var connections = [];
var charA = [];
var timer = 0;
var room = `room1`;
var setint = 0;


app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
app.get(`/`, async (req, res) => {

  res.render(`indexsock`);
})

io.sockets.on(`connection`, function(socket) {


  socket.on('room', function(room) {
    socket.join(room);
    console.log('join room ' + room);
  });

  socket.on('client_character', function(msg) {

    console.log('Data from client: ' + msg.position + ` and ` + msg.Identifier);
    if(charA.length==0){
      charA.push(msg);
    }else{
      if(msg.keycode != 8 && charA[0].keycode != 8){
        insertinsert()
      }else if(msg.keycode != 8 && charA[0].keycode == 8){
        insertdelete();
      }else if(msg.keycode == 8 && charA[0].keycode != 8){
        deleteinsert();
      }else{
        deletedelete();
      }


    }
    socket.in(room).broadcast.emit('server_character', charA[0]);

  socket.on(`send message`, function(data) {
    console.log(data);
    io.sockets.emit('new message', {
      msg: data
    });
  })

  function insertinsert(){
    if(charA.length==0){
      charA.push(msg);
    }else{
      if(msg.position<charA[0].position || msg.position == charA[0].position){
        charA.length = 0;
        charA.push(msg);
      }else{
        charA.length=0;
        charA.push(msg)
        charA[0].position++
      }
  }
}
function insertdelete(){
  if(msg.position <= charA[0].position){
    charA.length=0;
    charA.push(msg);
  }else{
    charA.length = 0;
    charA.push(msg);
    charA[0].position--;
  }
}
function deleteinsert(){
  if(msg.position<charA[0].position){
    charA.length = 0;
    charA.push(msg);
  }else{
    charA.length = 0;
    charA.push(msg);
    char[0].position++;
  }
}
function deletedelete(){
  if(msg.position<charA[0].position){
    charA.length = 0;
    charA.push(msg);
  }else if(msg.position>charA[0].position){
    charA.length = 0;
    charA.push(msg);
    charS[0].position--;
  }else{
    charA.length = 0;
    charA.push(msg);
  }
}
})
// socket.on('setinterval', function(){
//   if(setint == 0){
//     console.log('start');
//     setInterval(clearbuffer,10000);
//     setint++
//   }
// })
// function clearbuffer(){
//   socket.in(room).broadcast.emit('server_character', charA[0]);
//   charA.length = 0;
//   console.log('cleared');
// }
})




server.listen(port, () => {
  console.log(`Listening on port ${port}....`);
});


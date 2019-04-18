const express = require(`express`);
const path = require(`path`);
const app = express();
const server = require(`http`).createServer(app);
const io = require(`socket.io`).listen(server);
const port = process.env.PORT || 3000;



var charA = [];
var room = `room1`;
var setint = 0;


app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
app.get(`/`, async (req, res) => {

  res.render(`indexsock`);
})

//Activates on socket connection
io.sockets.on(`connection`, function(socket) {

  //When another client joins the room
  socket.on('room', function(room) {
    socket.join(room);
    console.log('join room ' + room);
  });

  //This handles the event, client_character. When the client types in a character, an event activates which send the server msg
  // containing some information. The msg contains position of the caret, identifier, keycode(tells you if the action is a delete or insert)
  // and an area(the character sent)
  socket.on('client_character', function(msg) {

    console.log('Data from client: ' + msg.position + ` and ` + msg.Identifier);
    //This is the start of the operational transformation. When a msg is sent to the server,
    //it is temporarily stored in a buffer called charA. If there is no other value in charA, the data
    //in the buffer is emitted back to the clients so that it can be displayed. If the buffer has a value already,
    // the msg is then compared to whatever in the buffer. The logic here is that if another user
    // send a msg while the server is still handling a previous message, the server can then handle both messages.
    if(charA.length==0){
      charA.push(msg);
    }else{
      //occurs when both transactions want to insert a value
      if(msg.keycode != 8 && charA[0].keycode != 8){
        insertinsert()

      //occurs when the buffer has a delete message and an incoming insert message has arrived
      }else if(msg.keycode != 8 && charA[0].keycode == 8){
        insertdelete();

      //occurs when the buffer has an insert message and an incoming delete message occurs
      }else if(msg.keycode == 8 && charA[0].keycode != 8){
        deleteinsert();

      //occurs when both tranactions want to delete
      }else{
        deletedelete();
      }
    }
    //emit when anc clear buffer
    socket.in(room).broadcast.emit('server_character', charA[0]);
    charA.length=0;


  socket.on(`send message`, function(data) {
    console.log(data);
    io.sockets.emit('new message', {
      msg: data
    });
  })

  //on the insertinsert function, the message in the buffer is an insert and an incoming insert transaction also occurs.
  //When this happens, we need to check which of the messages has a lower position they want to place their message.
  //If the incoming message has a lower position, we emit the buffer first because since the buffer position is greater,
  // it will not affect the position of the incoming message.
  //The same thing works vice versa, if the buffer has the lower position, we want to emit the incoming message first to avoid conflict.
  function insertinsert(){
      if(msg.position<charA[0].position || msg.position == charA[0].position){
        socket.in(room).broadcast.emit('server_character', charA[0]);
        socket.in(room).broadcast.emit('server_character', msg);
        charA.length=0;
      }else{
        socket.in(room).broadcast.emit('server_character', msg);
        socket.in(room).broadcast.emit('server_character', charA[0]);
        charA.length=0;
      }
}

//insertDelete function serves the same purpose. If the incoming transaction is an insert and has a lower position,
//we want to emit the buffer which contains a delete message at a higher position. The delete should not affect the
//insert because it has a higher position. The same works vice versa. If the buffer's delete message is at a lower position
// emit the insert first to avoid messing with the delete message.
function insertdelete(){
  if(msg.position <= charA[0].position){
    socket.in(room).broadcast.emit('server_character', charA[0]);
    socket.in(room).broadcast.emit('server_character', msg);
    charA.length=0;
  }else{
    socket.in(room).broadcast.emit('server_character', msg);
    socket.in(room).broadcast.emit('server_character', charA[0]);
    charA.length=0;
  }
}

//DeleteInsert works the same as InsertDelete
function deleteinsert(){
  if(msg.position<charA[0].position){
    socket.in(room).broadcast.emit('server_character', charA[0]);
    socket.in(room).broadcast.emit('server_character', msg);
    charA.length=0;
  }else{
    socket.in(room).broadcast.emit('server_character', msg)
    socket.in(room).broadcast.emit('server_character', charA[0]);
    charA.length=0;
  }
}
//deletedelete function will work the same as the rest of the functions. The high position message with emit first.
//The difference here is that if both messages want to delete at the same spot. To resolve this, we simply make the transaction only
//only occur once.
function deletedelete(){
  if(msg.position<charA[0].position){
    socket.in(room).broadcast.emit('server_character', charA[0]);
    socket.in(room).broadcast.emit('server_character', msg);
    charA.length=0;
  }else if(msg.position>charA[0].position){
    socket.in(room).broadcast.emit('server_character', msg);
    socket.in(room).broadcast.emit('server_character', charA[0]);
    charA.length=0;
  }else{
    socket.in(room).broadcast.emit('server_character', msg);
    charA.length=0;
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

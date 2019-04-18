function simulateKeyPress(character) {
  jQuery.event.trigger({
    type: 'keypress',
    which: character.charCodeAt(0)
  });
}

$(function() {
  var socket = io.connect('http://localhost:3000', {
    'sync disconnect on unload': false
  });


  var room = "room1";
  var createroom = 0;
  socket.on('connect', function() {
    socket.emit('setinterval');
    socket.emit('room', room);
  });

  /*
    Socket receives and event from the server:
    obtains the newly sent information from the server and displays the new document to the clients
  */

  socket.on('server_character', function(content) {
    console.log('From Server: Position: ' + content.position);
    console.log('From Server: Identifier: ' + content.Identifier);

    // var output = [content.area.slice(0, content.position), content.Identifier, content.area.slice(content.position)].join('');
    var output = content.area.substr(0, content.position) + content.area.substr(content.position);
    content.area = output;
    console.log(`output: ` + output);

    document.getElementById('notepad').value = output;

  });


  /*
    Jquery event:
    Watches id notepad and sends information to the server every keystroke.
    Takes the value of the clients notepad, the position of the cursor and saves the information into a JSON style format
    Sends the 'info' object to the server
  */
  $('#notepad').on('keyup', function(e) {


    var character = $('#notepad').val();
    var cursorPosStart = $('#notepad').prop('selectionStart');

    //converts the character code into an actual character
    var value = String.fromCharCode(e.which);
    var info = {
      position: cursorPosStart,
      Identifier: value,
      keycode:e.which,
      area:character
    }

    socket.emit('client_character',info);

  });



});

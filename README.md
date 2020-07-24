# OT-Editor

An attempt at recreating OT for concurrent file editing applications like Google docs.


### Code Explanation


  We wanted to start our implementation of OT right when the server receives a message from the client. When a msg is sent to the server, 
it is temporarily stored in a buffer. If there is no other value in this buffer, the data in the buffer is emitted back to 
the clients so that it can be displayed. If the buffer has a value already, the message is then compared to the message in the buffer. 
The logic here is that if another user sends a message while the server is still handling a previous message, the server can then handle both messages. 


We used a few different functions to try and compare the messages depending if the message is a delete or insert type. When the buffer and the incoming
message are both inserts, the function insertinsert is called. When the buffer has a delete message and the incoming message is an insert, the insertdelete
function is called. When the buffer is an insert message and the incoming message is a delete message, then the function deleteinsert is called. Finally, if 
both messages are deletes, then deletedelte is called. 



On the insertinsert function, the message in the buffer is an insert and an incoming insert transaction also occurs. When this happens, 
we need to check which of the messages has a lower position they want to place their message. If the incoming message has a lower position, 
we emit the buffer first because since the buffer position is greater, it will not affect the position of the incoming message. The same thing 
works vice versa, if the buffer has the lower position, we want to emit the incoming message first to avoid conflict. For example, if we have string
ABCD and buffer wants to place a ‘1’ at the end of the string (position 4) and the incoming message wants to place ‘2’ at the beginning (position 0).
If we were to place 2 at the beginning first, then we would have to change the position placement of the buffer because the position of each 
character has changed, but if we place the ‘1’ at the end first, it does not affect the positions of the previous characters. We applied this logic to 
all of our comparison functions. 



insertdelete function serves the same purpose. If the incoming transaction is an insert and has a lower position, we want to emit the buffer which contains
a delete message at a higher position. The delete should not affect the insert because it has a higher position. The same works vice versa. If the buffer's
delete message is at a lower position emit the insert first to avoid messing with the delete message. Deleteinsert works the same as the insertdelete function. 
The deletedelete function works the same way as the other function with one minor difference. When both the buffer and the incoming message want to delete in
the same spot, the function simply only emits the delete message once. 


Additionally: This OT collaborative editor only works with letter and number keyboard values. Using any other keyboard event
may cause problems with the editor. This repository does not account for latency and only individual character wise transformations. 

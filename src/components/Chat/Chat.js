import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography, TextField, Button } from '@mui/material';

function Chat({ messages }) {
  const [newMessage, setNewMessage] = useState('');

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleNewMessageSubmit = () => {
    // TODO: handle the new message
    // for the purpose of this example, we just clear the text field
    setNewMessage('');
  };

  return (
    <div sx={{width: '100%'}}>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {messages.map((message, index) => (
          <ListItem key={index} alignItems="flex-start">
            {message.role === 'assistant' ? (
              <>
                <ListItemText
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {message.content}
                    </Typography>
                  }
                />
              </>
            ) : (
              <>
                <ListItemText
                  primary={message.name}
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {message.content}
                    </Typography>
                  }
                />
              </>
            )}
          </ListItem>
        ))}
      </List>
      <TextField
        value={newMessage}
        onChange={handleNewMessageChange}
        placeholder="Type your message..."
        fullWidth
      />
      <Button onClick={handleNewMessageSubmit}>Send</Button>
    </div>
  );
}

export default Chat;

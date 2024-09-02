'use client'
import Image from "next/image";
import {useState} from 'react';
import {Box, Stack, TextField, Button, Typography} from '@mui/material';
import ReactMarkdown from 'react-markdown';

export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi I'm CVAI assistant. How can I assist you today?`,
    }
  ]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setMessage('');
    setMessages((messages) => [
      ...messages,
      {role: 'user', content: message},
      {role: 'assistant', content: ''},
    ]);

    const response = fetch('/api/chat', {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify([...messages, {role: 'user', content: message}])
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(
        function processText({done, value}) {
        if (done) {
          return result;
        } 

        const text = decoder.decode(value || new Int8Array(), {stream: true})
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);

          return ([
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            }
          ])
        });
        return reader.read().then(processText);
      })
    })
  }
  
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
    >
      <Box
        width="100vw"
        height="10vh"
        bgcolor="black"
        display="flex"
        alignItems="center"
      >
        <Typography
          variant="h4"
          marginLeft={4}
          color="white"
          display="flex"
          flex={1}
        >CVAI</Typography>
       <Box
          marginRight={4}
       >
        <Button
          variant="outlined"
        >
          Get Started
        </Button>
       </Box>
      </Box>
      <Box
        height="90vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="black"
      >
        <Stack
            direction="column"
            width="50vw"
            height="80vh"
            border="1px solid white"
            borderRadius={2}
            p={2}
            spacing={2}
        >
          <Stack
            direction="column"
            flexGrow={1}
            spacing={2}
            overflow="auto"
            maxHeight="100%"
          >
            {
              messages.map((message, index)=>(
                <Box 
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === 'assistant' ? 'flex-start' : 'flex-end'
                  }
                >
                  <Box
                    bgcolor={
                      message.role === 'assistant' ? 'primary.main' : 'secondary.main' 
                    }
                    color="white"
                    p={message.content.includes('*') ? 4 : 2}
                    borderRadius={2}
                    width={message.content.length > 20 ? "70%" : "40%"}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </Box>
                </Box>
              ))
            }
          </Stack>
          <Stack
            direction="row"
            spacing={2}
          >
            <TextField
              value={message}
              onChange={(e)=> {setMessage(e.target.value)}}
              fullWidth
              label="message"
              variant="outlined"
              focused
              sx={{
                input: {
                  color: 'white',
                },
              }}
            />
            <Button variant="contained" onClick={sendMessage}>Send</Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

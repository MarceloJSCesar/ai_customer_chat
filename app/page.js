'use client'
import {useState, useEffect} from 'react';
import {Box, Stack, TextField, Button, Typography} from '@mui/material';
import ReactMarkdown from 'react-markdown';
// useRouter
import { useRouter } from 'next/navigation'
 

export default function Home() {
  const router = useRouter()

  const [limit, setLimit] = useState(0);

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 767);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [canTry, setCanTry] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi I'm Implement AI assistant. How can I assist you today?`,
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

          setLimit(limit + 2);

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

  function canShowChat() {
    setCanTry(!canTry);
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
          variant={isMobile ? "h5" : "h3"}
          marginLeft={4}
          color="white"
          display="flex"
          flex={3}
        >Implement AI</Typography>
       <Box
          marginRight={4}
          gap={2}
       >
        <Button
          variant="outlined"
          onClick={() => {
            // canShowChat()
            router.push("/inquiry_now")
            // send to another page and fill out the blanks then it suposes to send an email
          }}
        >
        Inquiry Now
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
        <Box
          display={canTry ? "none" : "flex"}
          width="100vw"
          height="90vh"
          justifyContent="center"
          flexDirection="column"
        >
          <Box
            flex={1}
            alignContent="center"
          >
              <Box
                width="80vw"
                marginLeft={4}
              >
                <Typography
                  variant={isMobile ? "h5" : "h2"}
                  color="white"
                >
                  Implement AI Chat Assistant specialized for your business within minutes.
                </Typography>
              </Box>
              <Box
                display="flex"
                width="80vw"
              >
                <Box
                  marginLeft={4}
                  marginTop={4}
                >
                  <Button variant="contained" onClick={() => {
                    canShowChat();
                  }}>Try it out</Button>
                </Box>
              </Box>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
            >
              <Typography variant="h7" color="white">Copyright © 2024 Implement AI. All rights reserved.</Typography>
            </Box>
          </Box>
        <Box
            display={canTry ? "flex" : "none"}
        >
          <Stack
              direction="column"
              width={isMobile ? "90vw" : "50vw"}
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
              display={limit >= 6 ? "none" : "flex"}
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
          <Box
            display={limit >= 6 ? "flex" : "none"}
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
                <Typography variant="p" color="grey">Limit reached</Typography>
                <Button
                    variant="outlined"
                    onClick={() => {
                      canShowChat()
                      // send to another page and fill out the blanks then it suposes to send an email
                    }}
                    >
                    Inquiry Now
                </Button>
          </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

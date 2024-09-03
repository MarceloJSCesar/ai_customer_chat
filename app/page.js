'use client'
import {useState, useEffect} from 'react';
import {Box, Stack, TextField, Button, Typography, Modal} from '@mui/material';
import ReactMarkdown from 'react-markdown';
// useRouter
import { useRouter } from 'next/navigation'
import Head from 'next/head';
import TryOutModal from './components/tryout_modal';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkIfMobile = () => setIsMobile(window.matchMedia('(max-width: 600px)').matches);

      checkIfMobile(); // Initial check
      window.addEventListener('resize', checkIfMobile); // Update on resize

      return () => {
        window.removeEventListener('resize', checkIfMobile);
      };
    }
  }, []);

  return isMobile;
}
 

export default function Home() {
  const isMobile = useIsMobile();
  const router = useRouter()

  const [open, setOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  const [limit, setLimit] = useState(0);
  const [canTry, setCanTry] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi I'm Implement.AI assistant. How can I assist you today?`,
    }
  ]);


  const sendMessage = async () => {
    setMessage('');
    if(message.length > 0) {
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
        body: JSON.stringify({
          messages: [...messages, {role: 'user', content: message}],
          systemPrompt: systemPrompt,
        }),
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
  }

  function canShowChat() {
    setCanTry(!canTry);
  }

  function handleOpen() {setOpen(true)};
  function handleClose() {
    setSystemPrompt(`You are an AI assistant for ${companyName}. ${companyDescription}.
      ### Key Functions:  
        1. **User Onboarding**: Guide new users through the registration and setup process, explaining the key features of ${companyName}.
        2. **Feedback Collection**: Encourage users to provide feedback on their experience and help direct them to the appropriate channels for more in-depth support if needed.
        3. **Troubleshooting**: Offer solutions to common problems, such as errors during integration or difficulties with specific AI features.
        4. **Technical Assistance**: Assist users with any technical issues they encounter on the platform, including setup problems, integration issues, and account management.

      ### Communication Style:
        - **Tone**: Friendly, supportive, and professional.
        - **Clarity**: Provide clear, step-by-step instructions when guiding users.
        - **Empathy**: Acknowledge user concerns and frustrations, offering reassurance and quick resolutions.
        - **Be Concise**: Identify user concerns and provide concise, to-the-point answers.

        ### Special Instructions:
        - If the user encounters an issue that cannot be resolved through basic troubleshooting, escalate the issue by providing them with contact information for human support.
        - Encourage users to explore the platform's full range of features, including advanced AI tools and integration options.
        - Stay up-to-date with the latest platform updates and AI integration practices to provide accurate and relevant information.
      `)
    if(companyName.length > 0 && companyDescription.length > 0) {
      canShowChat();
    }
    setOpen(false)
    // go to chat
  };
  
  return (
    <>
      <Head>
        <title></title>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=G-${process.env.NEXT_PUBLIC_GTAG_API_KEY}`}/>
        <script dangerouslySetInnerHTML={
          {
            __html: `  
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GTAG_API_KEY}');
            `
          }
        } />
      </Head>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
      >
        <TryOutModal // opened when clicked 'TRY IT OUT'
            open={open}
            isMobile={isMobile}
            tryNow={handleClose}
            companyName={companyName}
            setCompanyName={setCompanyName}
            companyDescription={companyDescription}
            setCompanyDescription={setCompanyDescription}
        />
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
          >Implement.AI</Typography>
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
                    Implement.AI Chat Assistant specialized for your business within minutes.
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
                      // canShowChat();
                      handleOpen();
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
                <Typography variant="h7" color="white">Copyright © 2024 Implement.AI. All rights reserved.</Typography>
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
                        router.push("/inquiry_now")
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
    </>
  );
}

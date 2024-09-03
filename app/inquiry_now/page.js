'use client'
import {useState, useEffect} from 'react';
import {Box, Typography, Button, TextField, FormControl, InputLabel, Input} from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomTextField from './components/custom_textfield';
import EmailJS, { send } from '@emailjs/browser';

export default function InquiryNow() {

    // fields parameters value
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sendMessageResponse, setSendMessageResponse] = useState('default');

    var templateParams = {
      "from_name": name,
      "from_email": email,
      "subject": subject,
      "message": message,
    };  

    function sendMessage() {
      console.log('publickey: ', process.env.EMAILJS_API_KEY);
      EmailJS.send('service_3p9jcq7', 'template_2c1wbyq', templateParams, {
          publicKey: process.env.EMAILJS_API_KEY,
      })
      .then(
          () => {
              console.log('success');
              setSendMessageResponse('success');
              setName('');
              setEmail('');
              setSubject('');
              setMessage('');
          },
          (error) => {
              console.log('error', error);
              setSendMessageResponse('error');
          }
      )
  }

    const router = useRouter();

    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
      setIsMobile(window.innerWidth <= 767);
      console.log('isMobile', isMobile);
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 767);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="black"
    >
        <Box
        width="100vw"
        height="10vh"
        display="flex"
        alignItems="center"
        >
            <Typography
                variant={isMobile ? "h5" : "h3"}
                marginLeft={4}
                color="white"
                display="flex"
                flex={3}
                >Implement AI
            </Typography>
            <Box
                marginRight={4}
                gap={2}
            >
                <Button
                variant="outlined"
                onClick={() => {
                    // canShowChat()
                    router.push("/")
                    // send to another page and fill out the blanks then it suposes to send an email
                }}
                >
                Get Started
                </Button>
            </Box>
        </Box>
        <CustomTextField
            nameValue={name}
            onNameChange={(e) => setName(e.target.value)}
            emailValue={email}
            onEmailChange={(e) => setEmail(e.target.value)}
            subjectValue={subject}
            onSubjectChange={(e) => setSubject(e.target.value)}
            messageValue={message}
            onMessageChange={(e) => setMessage(e.target.value)}
            isMobile={isMobile}
            sendMessageResponse={sendMessageResponse}
            sendMessage={sendMessage}
        />
    </Box>
    );
}
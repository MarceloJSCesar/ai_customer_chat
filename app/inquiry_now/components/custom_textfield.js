import { Box, TextField, Button } from '@mui/material';

const CustomTextField = ({
  nameValue,
  onNameChange,
  emailValue,
  onEmailChange,
  subjectValue,
  onSubjectChange,
  messageValue,
  onMessageChange,
  isMobile,
  sendMessageResponse,
  sendMessage,
}) => {

  return (
    <Box
      height="90vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} // Two columns on medium+ screens, one column on small screens
        gap={3}
        justifyContent="center"
        alignItems="center"
        maxWidth={isMobile ? "80vw" : "800px"}
        width={isMobile ? "80vw" : "100%"}
      >
        {/* First Row: Name and Email */}
        <TextField 
          variant="outlined" 
          placeholder="Name"
          value={nameValue}
          onChange={onNameChange}
          sx={{
            width: '100%',
            bgcolor: 'white'
          }}
        />
        <TextField 
          variant="outlined" 
          placeholder="Email"
          value={emailValue}
          onChange={onEmailChange}
          sx={{
            width: '100%',
            bgcolor: 'white',
          }}
        />
        {/* Second Row: Subject */}
        <TextField 
          variant="outlined" 
          placeholder="Subject"
          value={subjectValue}
          onChange={onSubjectChange}
          sx={{
            gridColumn: 'span 2', // Span across both columns
            width: '100%',
            bgcolor: 'white'
          }}
        />
        {/* Third Row: Message */}
        <TextField 
          variant="outlined" 
          placeholder="Message"
          multiline
          rows={4}
          value={messageValue}
          onChange={onMessageChange}
          required
          sx={{
            gridColumn: 'span 2', // Span across both columns
            width: '100%',
            bgcolor: 'white'
          }}
        />
      </Box>

      {/* Button */}
      <Button 
        variant="contained" 
        color={sendMessageResponse === 'default' ? 'primary' : sendMessageResponse === 'success' ? 'success' : 'error'}
        sx={{ mt: 3 }}
        onClick={sendMessage}
      >
        {sendMessageResponse === 'default' ? 'Send Message' : sendMessageResponse === 'success' ? 'sent sucessfully' : 'error occured'}
      </Button>
    </Box>
  );
};

export default CustomTextField;

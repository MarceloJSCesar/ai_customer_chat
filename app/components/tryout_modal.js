import {Box, TextField, Button, Modal} from '@mui/material';

export default function TryOutModal({
    open,
    isMobile,
    tryNow,
    companyName,
    setCompanyName,
    companyDescription,
    setCompanyDescription,
}) {
    return (
        <Modal
            open={open}
        >
            <Box
              width={isMobile ? "70%" : "400px"}
              top="50%"
              left="50%"
              bgcolor="white"
              position="absolute"
              p={4}
              display="flex"
              flexDirection="column"
              borderRadius={8}
              gap={3}
              sx={{
                transform: "translate(-50%, -50%)"
              }}
            >
              <TextField 
                variant="outlined" 
                placeholder="Company Name"
                value={companyName}
                required={true}
                onChange={(e) => setCompanyName(e.target.value)}
                sx={{
                  width: '100%',
                  bgcolor: 'white'
                }}
              />
              <TextField 
                variant="outlined" 
                placeholder="Brief Description about the company and what it does"
                multiline
                value={companyDescription}
                required={true}
                onChange={(e) => setCompanyDescription(e.target.value)}
                rows={3}
                sx={{
                  width: '100%',
                  bgcolor: 'white'
                }}
              />
              <Button variant='contained' onClick={tryNow}>Try Now</Button>
            </Box>
        </Modal>
    );
}
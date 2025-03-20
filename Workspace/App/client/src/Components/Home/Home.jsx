import "./Home.css";
import DateContainer from "../miniCalendar/DateContainer";
import { Typography, Button, Container, Box, Paper } from "@mui/material";
// npm install @mui/material @emotion/react @emotion/styled

const Home = () => {
    return ( 
        <div className="Home_byNghi">
            {/* Mini Calendar */}
            <div className="date-container">
                <DateContainer/>
            </div>

            {/* Nội dung chính */}
            <div>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ padding: 1, textAlign: "center", borderRadius: 3 }}>
                    <Box mt={5}>
                        <Typography 
                            variant="h2" 
                            fontWeight="bold" 
                            color="primary"
                            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}
                        >
                            The happier workspace
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                            UsabilityHub is a remote user research platform that takes the
                            guesswork out of design decisions by validating them with real users.
                        </Typography>
                        <Button variant="contained" color="primary" size="large" sx={{ mt: 4, borderRadius: 2 }}>
                            Get Started
                        </Button>
                    </Box>
                </Paper>
            </Container>
            </div>
        </div>
        
    );
};

export default Home;

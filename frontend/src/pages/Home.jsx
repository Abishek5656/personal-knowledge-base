import { Container, Typography, Box, Paper, Button, keyframes, useTheme, useMediaQuery } from "@mui/material";
import { CloudUpload, QuestionAnswer, Storage, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      background: "radial-gradient(circle at 50% 10%, #ffffff 0%, #f0f4f8 100%)",
      pt: { xs: 8, md: 12 },
      pb: { xs: 8, md: 12 },
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Decor */}
      <Box sx={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "40vw",
        height: "40vw",
        background: "linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)",
        borderRadius: "50%",
        filter: "blur(80px)",
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <Box sx={{ 
          textAlign: "center", 
          mb: { xs: 8, md: 12 }, 
          animation: `${fadeIn} 0.8s ease-out`
        }}>
          <Typography 
            variant="h1" 
            fontWeight="900" 
            gutterBottom
            sx={{ 
              background: "linear-gradient(90deg, #1565C0 0%, #1E88E5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              lineHeight: 1.1,
              letterSpacing: "-0.02em"
            }}
          >
            Your Knowledge.<br />Unleashed.
          </Typography>
          
          <Typography 
            variant="h5" 
            color="text.secondary" 
            paragraph 
            sx={{ 
              maxWidth: "800px", 
              mx: "auto", 
              mb: 6, 
              lineHeight: 1.6,
              fontSize: { xs: "1.1rem", md: "1.35rem" },
              opacity: 0.9
            }}
          >
            Securely upload documents and chat with your private knowledge base. 
            Local AI processing ensuring data privacy and instant answers.
          </Typography>
          
          <Button 
            variant="contained" 
            size="large" 
            endIcon={<ArrowForward />}
            onClick={() => navigate("/upload")}
            sx={{ 
              px: { xs: 4, md: 6 }, 
              py: { xs: 1.5, md: 2 }, 
              fontSize: { xs: "1rem", md: "1.2rem" }, 
              borderRadius: "50px",
              background: "linear-gradient(45deg, #1565C0 30%, #42A5F5 90%)",
              boxShadow: "0 10px 20px rgba(21, 101, 192, 0.2)",
              textTransform: "none",
              fontWeight: "bold",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 15px 25px rgba(21, 101, 192, 0.3)"
              }
            }}
          >
            Start Exploring
          </Button>
        </Box>

        {/* Features Section - Responsive Flex Layout */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          justifyContent: "center",
          alignItems: "stretch"
        }}>
          <FeatureCard 
            icon={<CloudUpload sx={{ fontSize: 48, color: "white" }} />}
            color="#1E88E5"
            title="Smart Upload"
            description="Drag & drop PDFs or text files. Automatic chunking and vectorization tailored for RAG pipelines."
            delay="0s"
          />
          <FeatureCard 
            icon={<QuestionAnswer sx={{ fontSize: 48, color: "white" }} />}
            color="#E91E63"
            title="Interactive Q&A"
            description="Chat with your documents naturally. Get citations and source tracking for every answer."
            delay="0.2s"
          />
          <FeatureCard 
            icon={<Storage sx={{ fontSize: 48, color: "white" }} />}
            color="#43A047"
            title="Private Storage"
            description="Your vectors are stored locally. No external cloud dependencies for your core knowledge data."
            delay="0.4s"
          />
        </Box>
      </Container>
    </Box>
  );
}

function FeatureCard({ icon, color, title, description, delay }) {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        flex: 1,
        p: 4, 
        borderRadius: 4,
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.8)",
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        animation: `${fadeIn} 0.8s ease-out ${delay} both`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)"
        }
      }}
    >
      <Box 
        sx={{ 
          mb: 3, 
          display: "flex", 
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          height: 80,
          borderRadius: "50%", 
          background: `linear-gradient(135deg, ${color}40 0%, ${color} 100%)`,
          boxShadow: `0 8px 16px ${color}40`
        }}
      >
        {icon}
      </Box>
      <Typography variant="h5" fontWeight="700" gutterBottom sx={{ color: "#1A2027", mb: 1.5 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {description}
      </Typography>
    </Paper>
  );
}

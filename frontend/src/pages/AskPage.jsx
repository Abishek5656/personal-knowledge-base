import { useState } from "react";
import { 
  Container, Typography, Box, Paper, Button, TextField, 
  CircularProgress, Alert, Divider, Chip, Avatar, useTheme 
} from "@mui/material";
import { Send, AutoAwesome, Description, Person, SmartToy } from "@mui/icons-material";
import { askQuestion } from "../services/qaService";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  
  const theme = useTheme();

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await askQuestion(question);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to get answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <Box sx={{ 
      minHeight: "calc(100vh - 64px)",
      background: "radial-gradient(circle at 50% 10%, #ffffff 0%, #f0f4f8 100%)",
      py: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 }, animation: "fadeIn 0.8s ease-out" }}>
          <Typography 
            variant="h3" 
            fontWeight="800" 
            gutterBottom
            sx={{ 
              background: "linear-gradient(90deg, #E91E63 30%, #9C27B0 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
              lineHeight: 1.2
            }}
          >
            Ask Your Knowledge Base
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
            Get instant answers referenced from your documents
          </Typography>
        </Box>

        {/* Question Input Card */}
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 2, md: 4 }, 
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
            mb: 4
          }}
        >
          <TextField
            fullWidth
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            disabled={loading}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#f8f9fa",
                p: { xs: 1, md: 2 }, // Reduce padding on mobile
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "#E0E0E0" },
                "&.Mui-focused fieldset": { borderColor: "#E91E63" }
              }
            }}
            InputProps={{
              startAdornment: (
                <Person sx={{ color: "text.disabled", mr: 1, mt: 0.5, display: { xs: "none", sm: "block" } }} />
              ),
              endAdornment: (
                <Button
                  variant="contained"
                  onClick={handleAsk}
                  disabled={!question.trim() || loading}
                  sx={{ 
                    borderRadius: "50%", // Fully rounded
                    minWidth: "40px",
                    height: "40px",
                    width: "40px",
                    p: 0,
                    ml: 1,
                    background: "linear-gradient(45deg, #E91E63 30%, #9C27B0 90%)",
                    boxShadow: "0 4px 12px rgba(233, 30, 99, 0.3)",
                    "&.Mui-disabled": { opacity: 0.6 }
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : <Send fontSize="small" />}
                </Button>
              )
            }}
          />
        </Paper>

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 3, mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Answer Section */}
        {result && (
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e0e0e0",
              boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
              animation: "slideUp 0.5s ease-out"
            }}
          >
            {/* Answer Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ bgcolor: "#E91E63", mr: 2 }}>
                <AutoAwesome />
              </Avatar>
              <Typography variant="h6" fontWeight="bold">
                AI Answer
              </Typography>
            </Box>

            {/* Answer Text */}
            <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: "1.1rem", color: "#333", mb: 4 }}>
              {result.answer}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* Sources */}
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Description fontSize="small" /> Sources Used
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {result.sources && result.sources.length > 0 ? (
                result.sources.map((src, index) => (
                  <Paper 
                    key={index}
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      bgcolor: "#f8f9fa", 
                      borderRadius: 2,
                      border: "1px solid #eee"
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Chip 
                        label={src.source} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                        sx={{ fontSize: "0.75rem", fontWeight: "bold" }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                      "...{src.text}..."
                    </Typography>
                  </Paper>
                ))
              ) : (
                <Typography variant="body2" color="text.disabled">
                  No specific sources cited.
                </Typography>
              )}
            </Box>
          </Paper>
        )}

        {/* Empty State / Placeholder */}
        {!result && !loading && (
          <Box sx={{ textAlign: "center", mt: 8, opacity: 0.6 }}>
            <SmartToy sx={{ fontSize: 60, color: "#e0e0e0", mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Ask any question related to your uploaded documents.<br/>
              I'll analyze the content and provide a precise answer.
            </Typography>
          </Box>
        )}

      </Container>
    </Box>
  );
}

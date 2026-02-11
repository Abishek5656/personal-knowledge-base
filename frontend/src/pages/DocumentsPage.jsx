import { useEffect, useState } from "react";
import { 
  Container, Typography, Box, Paper, Button, CircularProgress, 
  Grid, Alert, IconButton, useTheme, useMediaQuery 
} from "@mui/material";
import { InsertDriveFile, Refresh, CloudUpload, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getDocuments } from "../services/documentService";

export default function DocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getDocuments();
      const documentList = response.data.documents || [];
      // Deduplicate if needed, assuming API returns array of strings (filenames)
      setDocs([...new Set(documentList)]);
    } catch (err) {
      console.error(err);
      setError("Failed to load documents. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const isEmptyOrError = !loading && (!!error || docs.length === 0);

  return (
    <Box sx={{ 
      minHeight: "calc(100vh - 64px)",
      background: "radial-gradient(circle at 50% 10%, #ffffff 0%, #f0f4f8 100%)",
      py: 6,
      px: 2,
      display: "flex",
      flexDirection: "column",
      justifyContent: isEmptyOrError ? "center" : "flex-start",
      alignItems: "center"
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ 
          textAlign: "center", 
          mb: 6,
          animation: "fadeIn 0.8s ease-out"
        }}>
          <Typography 
            variant="h3" 
            fontWeight="800" 
            gutterBottom
            sx={{ 
              background: "linear-gradient(90deg, #1565C0 0%, #1E88E5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" }
            }}
          >
            Your Knowledge Base
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Manage and explore your uploaded documents.
          </Typography>

          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" }, 
            justifyContent: "center", 
            gap: 2, 
            mt: 3 
          }}>
             <Button 
                variant="outlined" 
                startIcon={<Refresh />}
                onClick={fetchDocuments}
                sx={{ 
                  borderRadius: "50px", 
                  px: 3, 
                  py: 1.5,
                  width: { xs: "100%", sm: "auto" },
                  borderColor: "#90CAF9",
                  color: "#1976D2",
                  fontWeight: "bold",
                  "&:hover": { borderColor: "#1E88E5", bgcolor: "rgba(33, 150, 243, 0.05)" }
                }}
              >
                Refresh List
              </Button>
              <Button 
                variant="contained" 
                startIcon={<CloudUpload />}
                onClick={() => navigate("/upload")}
                sx={{ 
                  borderRadius: "50px", 
                  px: 4,
                  py: 1.5,
                  width: { xs: "100%", sm: "auto" },
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #1565C0 30%, #42A5F5 90%)",
                  boxShadow: "0 4px 12px rgba(21, 101, 192, 0.3)"
                }}
              >
                Upload New
              </Button>
          </Box>
        </Box>

        {/* Content Section */}
        {loading ? (
           <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
             <CircularProgress size={50} thickness={4} sx={{ color: "#1E88E5" }} />
           </Box>
        ) : error ? (
           <Alert severity="error" sx={{ maxWidth: 600, mx: "auto", borderRadius: 4 }}>
             {error}
           </Alert>
        ) : docs.length === 0 ? (
           <Paper 
             elevation={0}
             sx={{ 
               p: 6, 
               textAlign: "center", 
               maxWidth: 600, 
               mx: "auto",
               borderRadius: 4,
               background: "rgba(255, 255, 255, 0.6)",
               border: "1px dashed #bdbdbd"
             }}
           >
             <CloudUpload sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
             <Typography variant="h6" color="text.secondary" gutterBottom>
               No documents found
             </Typography>
             <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
               Upload some documents to start building your knowledge base.
             </Typography>
             <Button variant="outlined" onClick={() => navigate("/upload")}>
               Go to Upload
             </Button>
           </Paper>
        ) : (
          <Grid container spacing={3}>
            {docs.map((doc, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: 4,
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    boxShadow: "0 4px 20px -5px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 30px -10px rgba(0,0,0,0.1)",
                      borderColor: "#90CAF9",
                      "& .icon-bg": {
                        transform: "scale(1.1) rotate(5deg)"
                      }
                    }
                  }}
                >
                  <Box 
                    className="icon-bg"
                    sx={{ 
                      p: 1.5, 
                      borderRadius: 3, 
                      bgcolor: "rgba(33, 150, 243, 0.1)",
                      color: "#1976D2",
                      transition: "transform 0.3s ease"
                    }}
                  >
                    <InsertDriveFile />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold" 
                      noWrap 
                      title={doc}
                      sx={{ color: "#333", mb: 0.5 }}
                    >
                      {doc}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ready for Q&A
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

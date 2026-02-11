import { useState, useRef } from "react";
import { 
  Container, Typography, Box, Paper, Button, CircularProgress, 
  Snackbar, Alert, IconButton, useTheme, useMediaQuery 
} from "@mui/material";
import { CloudUpload, InsertDriveFile, Close, CheckCircle } from "@mui/icons-material";
import { uploadDocument } from "../services/documentService";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const fileInputRef = useRef(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Handle File Select via Button
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'text/plain'];
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      setNotification({
        open: true,
        message: "Invalid file type. Please upload PDF or TXT files.",
        severity: "error"
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const result = await uploadDocument(file);
      setNotification({
        open: true,
        message: `Successfully uploaded ${result.data?.file || "document"}!`,
        severity: "success"
      });
      setFile(null); // Reset after success
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Upload failed. Please try again.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ 
      minHeight: "calc(100vh - 64px)", // Adjust for navbar height
      background: "radial-gradient(circle at 50% 10%, #ffffff 0%, #f0f4f8 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2
    }}>
      <Container maxWidth="md">
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 6 }, 
            borderRadius: 4,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {loading && (
            <Box sx={{ 
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0, 
              bgcolor: "rgba(255,255,255,0.8)", zIndex: 10, 
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"
            }}>
              <CircularProgress size={60} thickness={4} sx={{ color: "#1E88E5", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">Processing Document...</Typography>
            </Box>
          )}

          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ 
            background: "linear-gradient(90deg, #1565C0 0%, #1E88E5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1
          }}>
            Upload Knowledge
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Add PDF or TXT files to your private knowledge base.
          </Typography>

          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            sx={{
              border: `2px dashed ${dragActive ? "#1E88E5" : "#BDBDBD"}`,
              borderRadius: 4,
              p: { xs: 4, md: 6 },
              cursor: "pointer",
              bgcolor: dragActive ? "rgba(33, 150, 243, 0.05)" : "transparent",
              transition: "all 0.2s ease",
              mb: 4,
              "&:hover": {
                borderColor: "#1E88E5",
                bgcolor: "rgba(33, 150, 243, 0.02)"
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            
            {file ? (
              <Box sx={{ animation: "fadeIn 0.3s ease-out" }}>
                <InsertDriveFile sx={{ fontSize: 60, color: "#1E88E5", mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                </Typography>
              </Box>
            ) : (
              <Box>
                <CloudUpload sx={{ fontSize: 60, color: dragActive ? "#1E88E5" : "#90CAF9", mb: 2 }} />
                <Typography variant="h6" fontWeight="bold" color={dragActive ? "primary" : "text.primary"} gutterBottom>
                  {dragActive ? "Drop file here" : "Drag & Drop your file here"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to browse
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1, color: "text.disabled" }}>
                  Supports PDF and TXT
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column-reverse", sm: "row" }, 
            justifyContent: "center", 
            gap: { xs: 2, sm: 3 }, 
            mt: 2 
          }}>
            <Button 
              variant="outlined" 
              onClick={() => { setFile(null); }}
              disabled={!file || loading}
              sx={{ 
                borderRadius: "50px", 
                px: 4, 
                py: 1.5,
                borderColor: "#90CAF9",
                color: "#1976D2",
                fontWeight: "bold",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  borderColor: "#1E88E5",
                  bgcolor: "rgba(33, 150, 243, 0.05)"
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              size="large"
              onClick={handleUpload}
              disabled={!file || loading}
              startIcon={!loading && <CheckCircle />}
              sx={{ 
                borderRadius: "50px", 
                px: 5,
                py: 1.5,
                minWidth: { xs: "100%", sm: "180px" },
                fontWeight: "bold",
                background: "linear-gradient(45deg, #1565C0 30%, #42A5F5 90%)",
                boxShadow: "0 4px 12px rgba(21, 101, 192, 0.3)",
                whiteSpace: "nowrap",
                "&:disabled": {
                  background: "#e0e0e0",
                  color: "#9e9e9e"
                },
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(21, 101, 192, 0.4)"
                }
              }}
            >
              {loading ? "Uploading..." : "Upload File"}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

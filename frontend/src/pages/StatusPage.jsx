import { useEffect, useState } from "react";
import { 
  Container, Typography, Box, Paper, Button, CircularProgress, 
  Grid, Chip, Avatar, useTheme 
} from "@mui/material";
import { 
  CheckCircle, ErrorOutline, Refresh, Storage, 
  Dns, SmartToy, NetworkCheck 
} from "@mui/icons-material";
import { getStatus } from "../services/statusService";

export default function StatusPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError("");
      // Simulate slight delay for better UX on refresh
      await new Promise(r => setTimeout(r, 500));
      const response = await getStatus();
      setStatus(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to system services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusColor = (statusValue) => {
    return statusValue === "OK" ? "#4CAF50" : "#F44336";
  };

  const getStatusIcon = (statusValue) => {
    return statusValue === "OK" ? <CheckCircle /> : <ErrorOutline />;
  };

  const ServiceCard = ({ title, icon, value, delay }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        boxShadow: "0 8px 20px -5px rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        animation: `fadeIn 0.6s ease-out ${delay}`,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 12px 30px -10px rgba(0,0,0,0.1)"
        }
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: "rgba(33, 150, 243, 0.1)", color: "#1976D2" }}>
          {icon}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
          <Typography variant="caption" color="text.secondary">Service Health</Typography>
        </Box>
      </Box>
      
      {value ? (
        <Chip 
          icon={getStatusIcon(value)}
          label={value}
          sx={{ 
            bgcolor: `${getStatusColor(value)}15`, 
            color: getStatusColor(value),
            fontWeight: "bold",
            border: `1px solid ${getStatusColor(value)}30`
          }} 
        />
      ) : (
        <CircularProgress size={24} sx={{ color: "#bdbdbd" }} />
      )}
    </Paper>
  );

  return (
    <Box sx={{ 
      minHeight: "calc(100vh - 64px)",
      background: "radial-gradient(circle at 50% 10%, #ffffff 0%, #f0f4f8 100%)",
      py: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Container maxWidth="md">
        
        <Box sx={{ textAlign: "center", mb: 8, animation: "fadeIn 0.8s ease-out" }}>
          <Typography 
            variant="h3" 
            fontWeight="800" 
            gutterBottom
            sx={{ 
              background: "linear-gradient(90deg, #4CAF50 30%, #009688 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" }
            }}
          >
            System Status
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Real-time operational metrics for your knowledge base
          </Typography>
        </Box>

        {error && (
          <Paper 
            sx={{ 
              p: 4, mb: 4, textAlign: "center", borderRadius: 4, 
              bgcolor: "#FFEBEE", color: "#C62828", border: "1px solid #FFCDD2" 
            }}
          >
            <ErrorOutline sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">System Offline</Typography>
            <Typography>{error}</Typography>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<Refresh />} 
              onClick={fetchStatus}
              sx={{ mt: 2, borderRadius: 20 }}
            >
              Retry Connection
            </Button>
          </Paper>
        )}

        {/* Status Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ServiceCard 
              title="Backend API" 
              icon={<Dns />} 
              value={status?.backend || (loading ? null : (error ? "Offline" : null))} 
              delay="0s"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ServiceCard 
              title="Vector Database" 
              icon={<Storage />} 
              value={status?.database || (loading ? null : (error ? "Unknown" : null))} 
              delay="0.1s"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ServiceCard 
              title="LLM Engine" 
              icon={<SmartToy />} 
              value={status?.llm || (loading ? null : (error ? "Unknown" : null))} 
              delay="0.2s"
            />
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button 
            variant="contained" 
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
            onClick={fetchStatus}
            disabled={loading}
            sx={{ 
              borderRadius: "50px", 
              px: 6,
              py: 1.5,
              background: "linear-gradient(45deg, #43A047 30%, #1DE9B6 90%)",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              fontWeight: "bold"
            }}
          >
            {loading ? "Checking Status..." : "Refresh Status"}
          </Button>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 2 }}>
            Last checked: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}

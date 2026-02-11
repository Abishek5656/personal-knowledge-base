import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button
} from "@mui/material";

import Loader from "./Loader";

export default function StatusCard({ status, loading, onRefresh }) {

  const getColor = (value) => {
    return value === "OK" ? "success" : "error";
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Status
        </Typography>

        <Button
          variant="outlined"
          onClick={onRefresh}
          sx={{ mb: 2 }}
        >
          Refresh Status
        </Button>

        {loading && <Loader />}

        {status && !loading && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 2 }}>
              <Typography>
                Backend:
                <Chip
                  label={status.backend}
                  color={getColor(status.backend)}
                  sx={{ ml: 2 }}
                />
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography>
                Database:
                <Chip
                  label={status.database}
                  color={getColor(status.database)}
                  sx={{ ml: 2 }}
                />
              </Typography>
            </Box>

            <Box>
              <Typography>
                LLM:
                <Chip
                  label={status.llm}
                  color={getColor(status.llm)}
                  sx={{ ml: 2 }}
                />
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

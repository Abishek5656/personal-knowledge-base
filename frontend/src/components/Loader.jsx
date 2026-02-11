import { CircularProgress, Box } from "@mui/material";

export default function Loader() {
  return (
    <Box sx={{ textAlign: "center", marginTop: 2 }}>
      <CircularProgress />
    </Box>
  );
}

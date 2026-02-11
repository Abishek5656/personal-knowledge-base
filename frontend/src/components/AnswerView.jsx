import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box
} from "@mui/material";

export default function AnswerView({ data }) {
  if (!data) return null;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">
          Answer
        </Typography>

        <Typography sx={{ mt: 2 }}>
          {data.answer}
        </Typography>

        <Divider sx={{ mt: 3, mb: 2 }} />

        <Typography variant="h6">
          Sources
        </Typography>

        {data.sources.map((src, index) => (
          <Box
            key={index}
            sx={{
              mt: 2,
              p: 2,
              border: "1px solid #ddd",
              borderRadius: 2
            }}
          >
            <Typography variant="subtitle2">
              Document: {src.source}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              {src.text}
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}

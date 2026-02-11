import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert
} from "@mui/material";

import Loader from "./Loader";
import { askQuestion } from "../services/qaService";

export default function QuestionForm({ onResult }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await askQuestion(question);

      onResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to get answer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Ask a Question
        </Typography>

        <TextField
          fullWidth
          label="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          multiline
          rows={3}
        />

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Ask
        </Button>

        {loading && <Loader />}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

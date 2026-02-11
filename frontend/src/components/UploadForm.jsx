import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Alert
} from "@mui/material";

import Loader from "./Loader";
import { uploadDocument } from "../services/documentService";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await uploadDocument(file);

      setResult(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error uploading file"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Document
        </Typography>

        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
        />

        <br /><br />

        <Button
          variant="contained"
          onClick={handleUpload}
        >
          Upload
        </Button>

        {loading && <Loader />}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Alert severity="success" sx={{ mt: 2 }}>
            File: {result.file} <br />
            Chunks Stored: {result.chunksStored}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

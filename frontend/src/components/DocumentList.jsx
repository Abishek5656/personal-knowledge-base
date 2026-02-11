import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  Button
} from "@mui/material";

import Loader from "./Loader";
import { getDocuments } from "../services/documentService";

export default function DocumentList() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDocuments();
      setDocs(response.data.documents || []);
    } catch (err) {
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Uploaded Documents
        </Typography>

        <Button
          variant="outlined"
          onClick={fetchDocuments}
          sx={{ mb: 2 }}
        >
          Refresh
        </Button>

        {loading && <Loader />}

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {!loading && docs.length === 0 && (
          <Alert severity="info">
            No documents uploaded yet
          </Alert>
        )}

        <List>
          {docs.map((doc, index) => (
            <ListItem key={index}>
              <ListItemText primary={doc} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

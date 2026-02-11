import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";

const Home = lazy(() => import("./pages/Home"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));
const AskPage = lazy(() => import("./pages/AskPage"));
const StatusPage = lazy(() => import("./pages/StatusPage"));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/ask" element={<AskPage />} />
            <Route path="/status" element={<StatusPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
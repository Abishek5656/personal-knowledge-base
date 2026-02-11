import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box, useTheme, useMediaQuery } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Upload", path: "/upload" },
    { label: "Documents", path: "/documents" },
    { label: "Ask", path: "/ask" },
    { label: "Status", path: "/status" },
  ];

  const drawer = (
    <Box sx={{ textAlign: "center", pt: 4 }}>
      <IconButton onClick={handleDrawerToggle} sx={{ position: "absolute", right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
        Menu
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path} 
              onClick={handleDrawerToggle}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)"
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              fontWeight: "800", 
              background: "linear-gradient(45deg, #1565C0 30%, #42A5F5 90%)", // Matches Home gradient
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textDecoration: "none",
              fontSize: { xs: "1.2rem", sm: "1.5rem" }
            }}
          >
            Knowledge Q&A
          </Typography>

          {isMobile ? (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button 
                    key={item.label} 
                    component={Link} 
                    to={item.path}
                    sx={{ 
                      color: isActive ? "#1565C0" : "#555", 
                      fontWeight: isActive ? "bold" : "medium",
                      position: "relative",
                      "&::after": isActive ? {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: "10%",
                        width: "80%",
                        height: "2px",
                        backgroundColor: "#1565C0",
                        borderRadius: "2px"
                      } : {}
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

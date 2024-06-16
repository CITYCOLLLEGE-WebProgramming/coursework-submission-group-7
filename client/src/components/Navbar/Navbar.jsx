import React, { useContext, useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Typography, Avatar, Button, Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!isSmallScreen) {
      setDrawerOpen(false); 
    }
  }, [isSmallScreen]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = (
    <List>
      <ListItem component={Link} to="/" onClick={toggleDrawer(false)}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem component={Link} to="/list?type=buy" onClick={toggleDrawer(false)}>
        <ListItemText primary="Buy" />
      </ListItem>
      <ListItem component={Link} to="/list?type=rent" onClick={toggleDrawer(false)}>
        <ListItemText primary="Rent" />
      </ListItem>
      {currentUser && (
        <ListItem component={Link} to="/add" onClick={toggleDrawer(false)}>
          <ListItemText primary="Sell" />
        </ListItem>
      )}
      {!currentUser && (
        <>
          <ListItem component={Link} to="/login" onClick={toggleDrawer(false)}>
            <ListItemText primary="Sign in" />
          </ListItem>
          <ListItem component={Link} to="/register" onClick={toggleDrawer(false)}>
            <ListItemText primary="Sign up" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: '#006989' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            DreamEstate
          </Link>
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/list?type=buy">Buy</Button>
          <Button color="inherit" component={Link} to="/list?type=rent">Rent</Button>
          {currentUser && <Button color="inherit" component={Link} to="/add">Sell</Button>}
        </Box>
        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit" component={Link} to="/profile">
              {currentUser.avatar ? (
                <Avatar src={currentUser.avatar} alt={currentUser.username} />
              ) : (
                <Avatar alt={currentUser.username}>{currentUser.username.charAt(0)}</Avatar>
              )}
            </IconButton>
            <Typography variant="h6" component="div">
              {currentUser.username}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/login">Sign in</Button>
            <Button color="inherit" component={Link} to="/register">Sign up</Button>
          </Box>
        )}
      </Toolbar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {menuItems}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;

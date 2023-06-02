import { signOut, User } from 'firebase/auth'
import { useState } from 'react'
import NotificationDrawer from './NotificationDrawer'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Badge from '@mui/material/Badge'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { auth } from '../config/firebase'
import { Avatar, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
const Navbar = (props: { user: User }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [drawerOpenStatus, setDrawerOpenStatus] = useState<boolean>(false)
  const isMenuOpen = Boolean(anchorEl)

  const navigate = useNavigate()
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={() => signOut(auth)}>Logout</MenuItem>
    </Menu>
  )

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='medium'
            aria-label='back button'
            color='inherit'
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant='h6' noWrap component='div' sx={{ display: { xs: 'block' } }}>
            anumaan
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction='row' gap={2}>
            {/* <IconButton
              size='large'
              aria-label='show 17 new notifications'
              color='inherit'
              onClick={() => setDrawerOpenStatus(true)}
            >
              <Badge badgeContent={17} color='error'>
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
              sx={{ p: 0 }}
            >
              {props.user.photoURL ? (
                <Avatar alt={props.user.displayName || 'default-image'} src={props.user.photoURL} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Stack>
        </Toolbar>

        {renderMenu}
      </AppBar>
      <NotificationDrawer
        user={props.user}
        drawerOpenStatus={drawerOpenStatus}
        setDrawerOpenStatus={setDrawerOpenStatus}
      />
    </>
  )
}

export default Navbar

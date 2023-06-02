import { User } from 'firebase/auth'
import {
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { createSubCollection, Notification } from '../models/collections'
import { IconButton, Stack } from '@mui/material'
import Drawer from '@mui/material/Drawer'

import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'
const NotificationDrawer = (props: {
  user: User
  drawerOpenStatus: boolean
  setDrawerOpenStatus: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [lastNotification, setLastNotification] = useState<QueryDocumentSnapshot<Notification>>()
  const [disabled, setDisabled] = useState(false)
  useEffect(() => {
    // Query the first page of docs
    const fetchFirst = async () => {
      const notificationsCol = createSubCollection<Notification>(
        'users',
        props.user.uid,
        'notifications',
      )
      const first = query(notificationsCol, orderBy('notificationSentTimestamp', 'desc'), limit(2))
      const documentSnapshots = await getDocs(first)
      const notificationsList = documentSnapshots.docs.map((doc) => {
        return doc.data()
      })
      if (documentSnapshots.empty) {
        setDisabled(true)
      }
      setNotifications(notificationsList)
      setLastNotification(documentSnapshots.docs[documentSnapshots.docs.length - 1])
    }

    fetchFirst()
  }, [])

  const fetchNext = async () => {
    const notificationsCol = createSubCollection<Notification>('users', props.user.uid, 'attempts')
    const next = query(
      notificationsCol,
      orderBy('notificationSentTimestamp', 'desc'),
      startAfter(lastNotification),
      limit(2),
    )
    const documentSnapshots = await getDocs(next)
    const attemptsList = documentSnapshots.docs.map((doc) => {
      return doc.data()
    })
    setNotifications((prev) => [...prev, ...attemptsList])
    setLastNotification(documentSnapshots.docs[documentSnapshots.docs.length - 1])
    if (documentSnapshots.empty) {
      setDisabled(true)
    }
  }

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    boxShadow: theme.shadows[12],
  }))

  return (
    <Drawer
      anchor='right'
      open={props.drawerOpenStatus}
      onClose={() => props.setDrawerOpenStatus(false)}
    >
      <DrawerHeader>
        <Typography variant='h5' color='white'>
          Alerts
        </Typography>
        <IconButton color='inherit' onClick={() => props.setDrawerOpenStatus(false)}>
          <CloseIcon fontSize='large' />
        </IconButton>
      </DrawerHeader>
      <Stack
        sx={{ m: 2 }}
        direction='column'
        justifyContent='flex-start'
        alignItems='center'
        spacing={2}
      >
        {notifications.map((notification) => {
          return (
            <Card sx={{ minWidth: 275 }} key={notification.id}>
              <CardContent>
                <Typography variant='h5' component='div'>
                  {notification.notificationTitle}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color='text.secondary'>
                  {notification.notificationBody}
                </Typography>
                <Typography variant='body2'>
                  {notification.notificationSentTimestamp.toDate().toString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size='small'>{notification.attemptUrl}</Button>
              </CardActions>
            </Card>
          )
        })}

        {!disabled ? (
          <Button onClick={fetchNext} disabled={disabled}>
            FETCH MORE
          </Button>
        ) : (
          <Typography variant='body2'>You&apos;re Up to Date</Typography>
        )}
      </Stack>
    </Drawer>
  )
}

export default NotificationDrawer

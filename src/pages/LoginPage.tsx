import React, { useState } from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { usersCol } from '../models/collections'
import { Container } from '@mui/material'
import GoogleButton from 'react-google-button'
import Stack from '@mui/material/Stack'
import logo from '../assets/logo.png'
import Typography from '@mui/material/Typography'
const LoginPage = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  const [authing, setAuthing] = useState(false)

  const signInWithGoogle = async () => {
    setAuthing(true)

    signInWithPopup(auth, new GoogleAuthProvider())
      .then((response) => {
        console.log(response.user.uid)
        // setDoc(doc(usersCol, response.user.uid), {
        //   fcmToken: '234rdfshf',
        //   hasEnabledNotification: false,
        // })
        // console.log('doc set')

        navigate('/')
      })
      .catch((error) => {
        console.log(error)
        setAuthing(false)
      })
  }

  return (
    <Container fixed sx={{ bgcolor: 'beige', height: '100vh' }}>
      <Stack direction='column' justifyContent='center' alignItems='center' spacing={4} pt={20}>
        <img src={logo} width={80} />
        <Typography variant='h3'>anumaan</Typography>
        <GoogleButton disabled={authing} onClick={() => signInWithGoogle()} />
      </Stack>
    </Container>
  )
}

export default LoginPage

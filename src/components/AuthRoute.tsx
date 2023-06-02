import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../config/firebase'
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom'
import Navbar from './Navbar'

const AuthRoute = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        console.log('unauthorized')
        navigate('/login')
      }
    })

    return () => AuthCheck()
  }, [auth])

  if (!user) return <p>loading ...</p>

  return (
    <>
      <Navbar user={user} />
      <Outlet context={{ user }} />
    </>
  )
}

export function useUser() {
  return useOutletContext<{ user: User }>()
}

export default AuthRoute

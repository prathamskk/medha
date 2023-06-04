import { useNavigate } from 'react-router-dom'
import { Button, Stack } from '@mui/material'
import TouchDetector from '../components/TouchDetector'
import TempSensor from '../components/TempSensor'
const HomePage = () => {
  const navigate = useNavigate()
  return (
    <Stack direction={'column'} m={1} gap={1}>
      <Button
        size='large'
        fullWidth={true}
        variant='contained'
        onClick={() => navigate('/new')}
        sx={{ height: '25vh' }}
      >
        New Entry
      </Button>
      <Button
        color='secondary'
        size='large'
        fullWidth={true}
        variant='contained'
        type='submit'
        sx={{ height: '25vh' }}
        onClick={() => navigate('/attempts')}
      >
        All Records
      </Button>
      <Button
        color='success'
        size='large'
        fullWidth={true}
        variant='contained'
        type='submit'
        sx={{ height: '25vh' }}
        onClick={() => navigate('/romberg')}
      >
        Romberg's test
      </Button>
      <TouchDetector />
      <TempSensor />
    </Stack>
  )
}

export default HomePage

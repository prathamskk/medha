import { Button, Paper, Stack, Typography } from '@mui/material'
import { getDoc, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Scenario, scenariosCol } from '../../models/collections'
import AssignmentIcon from '@mui/icons-material/Assignment'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
const ScenarioDetailPage = () => {
  const { scenarioId } = useParams()

  const [scenario, setScenario] = useState<Scenario>()

  const navigate = useNavigate()
  useEffect(() => {
    // Query the first page of docs
    const fetchDoc = async () => {
      const docRef = doc(scenariosCol, scenarioId)
      const documentSnapshot = await getDoc(docRef)
      setScenario(documentSnapshot.data())
    }

    fetchDoc()
  }, [])

  return (
    <div>
      {scenario ? (
        <>
          <video controls poster={scenario.scenarioThumbnailLink} width={'100%'}>
            <source src={scenario.scenarioVideoLink} type='video/mp4' />
          </video>
          <Stack p={2} pb={15} gap={1}>
            <Typography variant='h4'>{scenario.scenarioName}</Typography>
            <Typography variant='body1'>{scenario.description}</Typography>
          </Stack>
        </>
      ) : (
        <div>Loading Scenario Details...</div>
      )}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <Stack direction={'row'} m={1} gap={1}>
          <Button
            size='large'
            fullWidth={true}
            variant='contained'
            startIcon={<KeyboardVoiceIcon />}
            onClick={() => navigate('new')}
          >
            New Attempt
          </Button>

          <Button
            color='secondary'
            size='large'
            fullWidth={true}
            variant='contained'
            startIcon={<AssignmentIcon />}
            onClick={() => navigate('attempts')}
          >
            Previous Submissions
          </Button>
        </Stack>
      </Paper>
    </div>
  )
}

export default ScenarioDetailPage

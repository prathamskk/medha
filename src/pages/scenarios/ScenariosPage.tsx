import {
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scenario, scenariosCol } from '../../models/collections'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Stack } from '@mui/material'
const ScenariosPage = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [lastScenario, setLastScenario] = useState<QueryDocumentSnapshot<Scenario>>()
  const [disabled, setDisabled] = useState(false)
  useEffect(() => {
    // Query the first page of docs
    const fetchFirst = async () => {
      const first = query(scenariosCol, orderBy('scenarioName'), limit(2))
      const documentSnapshots = await getDocs(first)
      const scenariosList = documentSnapshots.docs.map((doc) => {
        return doc.data()
      })
      if (documentSnapshots.empty) {
        setDisabled(true)
      }
      setScenarios(scenariosList)
      setLastScenario(documentSnapshots.docs[documentSnapshots.docs.length - 1])
    }

    // addDoc(scenariosCol, {
    //   scenarioName: 'bruh2',
    //   scenarioVideoLink: 'bruh2',
    //   exemplarVideoLink: 'asdad2',
    //   shortDescription: 'asdasd2',
    //   description: 'asdasd2',
    // })

    fetchFirst()
  }, [])

  const fetchNext = async () => {
    const next = query(scenariosCol, orderBy('scenarioName'), startAfter(lastScenario), limit(2))
    const documentSnapshots = await getDocs(next)
    const scenariosList = documentSnapshots.docs.map((doc) => {
      return doc.data()
    })
    setScenarios((prev) => [...prev, ...scenariosList])
    setLastScenario(documentSnapshots.docs[documentSnapshots.docs.length - 1])
    if (documentSnapshots.empty) {
      setDisabled(true)
    }
  }

  const navigate = useNavigate()
  return (
    <Stack direction='column' justifyContent='flex-start' alignItems='center' spacing={2} m={2}>
      {scenarios.map((scenario) => {
        return (
          <Card sx={{ width: '100%' }} key={scenario.id}>
            <CardMedia
              sx={{ height: 140 }}
              image={scenario.scenarioThumbnailLink}
              title={scenario.scenarioName}
            />
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                {scenario.scenarioName}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {scenario.shortDescription}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size='small' onClick={() => navigate(scenario.id || '')}>
                View More
              </Button>
            </CardActions>
          </Card>
        )
      })}

      {!disabled ? (
        <Button onClick={fetchNext} disabled={disabled}>
          Fetch More
        </Button>
      ) : (
        <Typography variant='body2'>You&apos;re Up to Date</Typography>
      )}
    </Stack>
  )
}

export default ScenariosPage

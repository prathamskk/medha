import {
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUser } from '../../components/AuthRoute'
import { Attempt, createSubCollection } from '../../models/collections'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CircularProgress, Stack } from '@mui/material'
import Button from '@mui/material/Button'
import selfAssessmentQuestions from '../../models/selfAssessmentQuestions.json'
import selfReflectiveQuestions from '../../models/selfReflectiveQuestions.json'
import Checkbox from '@mui/material/Checkbox'
import AttemptCard from '../../components/AttemptCard'

const ScenarioAttemptsPage = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [lastAttempt, setLastAttempt] = useState<QueryDocumentSnapshot<Attempt>>()
  const [disabled, setDisabled] = useState(false)
  const { user } = useUser()
  const { scenarioId } = useParams()

  useEffect(() => {
    // Query the first page of docs
    const fetchFirst = async () => {
      if (scenarioId) {
        const attemptsCol = createSubCollection<Attempt>('users', user.uid, 'attempts')
        const first = query(
          attemptsCol,
          where('scenarioId', '==', scenarioId),
          orderBy('submissionTimestamp', 'desc'),
          limit(2),
        )
        const documentSnapshots = await getDocs(first)
        const attemptsList = documentSnapshots.docs.map((doc) => {
          return doc.data()
        })
        if (documentSnapshots.empty) {
          setDisabled(true)
        }
        setAttempts(attemptsList)
        setLastAttempt(documentSnapshots.docs[documentSnapshots.docs.length - 1])
      }
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
    const attemptsCol = createSubCollection<Attempt>('users', user.uid, 'attempts')
    const next = query(
      attemptsCol,
      where('scenarioId', '==', scenarioId),
      orderBy('submissionTimestamp', 'desc'),
      startAfter(lastAttempt),
      limit(2),
    )
    const documentSnapshots = await getDocs(next)
    const attemptsList = documentSnapshots.docs.map((doc) => {
      return doc.data()
    })
    setAttempts((prev) => [...prev, ...attemptsList])
    setLastAttempt(documentSnapshots.docs[documentSnapshots.docs.length - 1])
    if (documentSnapshots.empty) {
      setDisabled(true)
    }
  }

  return (
    <Stack m={2} gap={2} alignItems='center'>
      <Typography variant='h4'>Previous Attempts</Typography>
      {attempts.map((attempt) => {
        const submissionTimestamp = attempt.submissionTimestamp as Timestamp
        return (
          <AttemptCard attempt={attempt} key={attempt.id} />
        )
      })}

      {!disabled ? (
        <Button onClick={fetchNext} disabled={disabled}>
          Load Older
        </Button>
      ) : (
        <Typography variant='body2'>You&apos;re Up to Date</Typography>
      )}
    </Stack>
  )
}

export default ScenarioAttemptsPage

import {
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useUser } from '../components/AuthRoute'
import { Attempt, createSubCollection } from '../models/collections'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { CircularProgress, Stack, TextField } from '@mui/material'
import Button from '@mui/material/Button'
import selfAssessmentQuestions from '../models/selfAssessmentQuestions.json'
import selfReflectiveQuestions from '../models/selfReflectiveQuestions.json'
import Checkbox from '@mui/material/Checkbox'
import symptomsAndDisease from '../models/symptomsAndDisease.json'

type diseasePrediction = {
  final_prediction: string,
  naive_bayes_prediction: string,
  rf_model_prediction: string,
  svm_model_prediction: string
}

const DiseasePredictionPage = () => {
  const [symptoms, setSymptoms] = useState('')
  const [diseasePrediction, setDiseasePrediction] = useState<diseasePrediction | null>(null)

  const getPrediction = () => {
    fetch("https://apilearnsbar.uptwocat.com/diseasepred/" + symptoms)
      .then(x => x.json())
      .then(x => setDiseasePrediction(x)
      )
  }

  return (
    <Stack m={2} gap={2} alignItems='center'>
      <Typography variant='h4'>Disease Prediction</Typography>
      <TextField id="standard-basic" label="Enter Symptoms Here" variant="standard" onChange={(event) => {
        setSymptoms(event.target.value);
      }} />
      <Button variant="contained"
        onClick={() => {
          getPrediction()
        }}>Predict</Button>
      <Typography variant='h4'>OUTPUT</Typography>
      <Typography variant='body1'>final Prediction :  {diseasePrediction?.final_prediction}</Typography>
      <Typography variant='body1'>svm_model Prediction :  {diseasePrediction?.svm_model_prediction}</Typography>
      <Typography variant='body1'>rf_model Prediction :  {diseasePrediction?.rf_model_prediction}</Typography>
      <Typography variant='body1'>naive_bayes Prediction :  {diseasePrediction?.naive_bayes_prediction}</Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Symptoms Accepted by Our Model</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul>
            {Object.keys(symptomsAndDisease.symptom_index).map((symptom) => {
              return <li key={symptom}>{symptom}</li>
            })}
          </ul>

        </AccordionDetails>
      </Accordion>

    </Stack>
  )
}

export default DiseasePredictionPage

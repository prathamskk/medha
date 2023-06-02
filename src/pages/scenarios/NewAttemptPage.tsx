import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { uploadBytes, getDownloadURL } from 'firebase/storage'
import { useState, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../../components/AuthRoute'
import { Attempt, createSubCollection } from '../../models/collections'
import { useForm } from 'react-hook-form'
import Recorder from '../../components/Recorder'
import { storage } from '../../config/firebase'
import { ref } from '@firebase/storage'
import { Button, Paper, Stack, TextField, Typography, Alert, Slider, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { useMultistepForm } from '../../hooks/useMultistepForm'
import Box from '@mui/material/Box'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import selfAssessmentQuestions from '../../models/selfAssessmentQuestions.json'
import selfReflectiveQuestions from '../../models/selfReflectiveQuestions.json'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const NewAttemptPage = () => {
  const navigate = useNavigate()
  // const { scenarioId } = useParams()
  const { user } = useUser()
  // const [beforeRecording, setBeforeRecording] = useState<Blob>()
  // const [afterRecording, setAfterRecording] = useState<Blob>()
  const { register, handleSubmit } = useForm<Attempt>()
  const { currentStepIndex, isFirstStep, isLastStep, back, next } = useMultistepForm([
    // 'BeforeAssessment',
    // 'SelfAssessment',
    // 'SelfReflective',
    // 'AfterAssessment',
    'generalinfo',
    'pain_L4_left',
    'pain_L4_right',
    'pain_C7_left',
    'pain_C7_right',
    'hot_sensation_L4_left',
    'hot_sensation_L4_right',
    'hot_sensation_C7_left',
    'hot_sensation_C7_right',
    'cold_sensation_L4_left',
    'cold_sensation_L4_right',
    'cold_sensation_C7_left',
    'cold_sensation_C7_right',
    // 'absoulte_tempature_L4_left',
    // 'absoulte_tempature_L4_right',
    // 'absoulte_tempature_C7_left',
    // 'absoulte_tempature_C7_right',
    // 'touch_L4_left',
    // 'touch_L4_right',
    // 'touch_C7_left',
    // 'touch_C7_right',
    // 'vibration_medial_malleolus_left',
    // 'vibration_medial_malleolus_right',
    // 'vibration_elbow_joint_left',
    // 'vibration_elbow_joint_right',
  ])

  function onSubmitForm(e: FormEvent) {
    e.preventDefault()
    if (!isLastStep) {
      return next()
    }
    onSubmit()
  }
  const onSubmit = handleSubmit(async (data) => {
    handleToggle()
    data.submissionTimestamp = serverTimestamp()

    const attemptsCol = createSubCollection<Attempt>('users', user.uid, 'attempts')
    const attemptRef = doc(attemptsCol)
    const attemptId = attemptRef.id
    // const folderRef = ref(storage, 'user_attempts/' + user.uid + '/' + attemptId)
    // const beforeAssessmentRef = ref(folderRef, 'before_assessment.wav')
    // const afterAssessmentRef = ref(folderRef, 'after_assessment.wav')
    // await uploadBytes(beforeAssessmentRef, beforeRecording).then(() => {
    // console.log('Uploaded before_assessment.wav')
    // })
    // await uploadBytes(afterAssessmentRef, afterRecording).then(() => {
    // console.log('Uploaded after_assessment.wav')
    // })
    // data.beforeAssessmentRecordingLink = await getDownloadURL(beforeAssessmentRef)
    // data.afterAssessmentRecordingLink = await getDownloadURL(afterAssessmentRef)
    await setDoc(attemptRef, data)
    setSuccess(true)
    console.log(data)
  })

  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const handleToggle = () => {
    setOpen(!open)
  }

  return (
    <Box m={2}>
      <form onSubmit={onSubmitForm}>
        {/* <div>{step}</div> */}
        <Box display={currentStepIndex == 0 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4'>Demographic Information</Typography>
            <Typography variant='h6'>{"Name"}</Typography>
            <TextField {...register('name')} variant='outlined' />
            <Typography variant='h6'>{"Age"}</Typography>
            <TextField {...register('age')} variant='outlined' />
            <Typography variant='h6'>{"Gender"}</Typography>
            <TextField {...register('gender')} variant='outlined' />
            <Typography variant='h6'>{"Provisional Diagnosis"}</Typography>
            <TextField {...register('provisional_diagnosis')} variant='outlined' />
            <Typography variant='h6'>{"OPD Number"}</Typography>
            <TextField {...register('opd_number')} variant='outlined' />
          </Stack>
        </Box>
        <Box display={currentStepIndex == 1 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Pain L4 Left</Typography>

            <Slider
              {...register('pain_L4_left')}
              // sx={{ m: 10 }}
              aria-label="Temperature"
              defaultValue={5}
              // getAriaValueText={valuetext}
              valueLabelDisplay="on"
              step={1}
              marks
              min={1}
              max={10}
            />
          </Stack>
        </Box>
        <Box display={currentStepIndex == 2 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Pain L4 Right</Typography>

            <Slider
              {...register('pain_L4_right')}
              // sx={{ m: 10 }}
              aria-label="Temperature"
              defaultValue={5}
              // getAriaValueText={valuetext}
              valueLabelDisplay="on"
              step={1}
              marks
              min={1}
              max={10}
            />
          </Stack>
        </Box>
        <Box display={currentStepIndex == 3 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Pain C7 Left</Typography>

            <Slider
              {...register('pain_C7_left')}
              // sx={{ m: 10 }}
              aria-label="Temperature"
              defaultValue={5}
              // getAriaValueText={valuetext}
              valueLabelDisplay="on"
              step={1}
              marks
              min={1}
              max={10}
            />
          </Stack>
        </Box>
        <Box display={currentStepIndex == 4 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Pain C7 Right</Typography>

            <Slider
              {...register('pain_C7_right')}
              // sx={{ m: 10 }}
              aria-label="Temperature"
              defaultValue={5}
              // getAriaValueText={valuetext}
              valueLabelDisplay="on"
              step={1}
              marks
              min={1}
              max={10}
            />
          </Stack>
        </Box>
        <Box display={currentStepIndex == 5 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Hot Sensation L4 Left</Typography>

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"

            >
              <FormControlLabel {...register('hot_sensation_L4_left')} value="normal" control={<Radio />} label="normal" />
              <FormControlLabel {...register('hot_sensation_L4_left')} value="abnormal" control={<Radio />} label="abnormal" />
            </RadioGroup>
          </Stack>
        </Box>
        <Box display={currentStepIndex == 6 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Hot Sensation L4 Right</Typography>

            <RadioGroup

              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"

            >
              <FormControlLabel {...register('hot_sensation_L4_right')} value="normal" control={<Radio />} label="normal" />
              <FormControlLabel {...register('hot_sensation_L4_right')} value="abnormal" control={<Radio />} label="abnormal" />
            </RadioGroup>
          </Stack>
        </Box>
        <Box display={currentStepIndex == 7 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Hot Sensation C7 Left</Typography>

            <RadioGroup

              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"

            >
              <FormControlLabel  {...register('hot_sensation_C7_left')} value="normal" control={<Radio />} label="normal" />
              <FormControlLabel  {...register('hot_sensation_C7_left')} value="abnormal" control={<Radio />} label="abnormal" />
            </RadioGroup>
          </Stack>
        </Box>
        <Box display={currentStepIndex == 8 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Hot Sensation C7 Right</Typography>

            <RadioGroup

              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"

            >
              <FormControlLabel {...register('hot_sensation_C7_right')} value="normal" control={<Radio />} label="normal" />
              <FormControlLabel  {...register('hot_sensation_C7_right')} value="abnormal" control={<Radio />} label="abnormal" />
            </RadioGroup>
          </Stack>
        </Box>
        <Box display={currentStepIndex == 9 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Cold Sensation L4 Left</Typography>

            <RadioGroup

              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"

            >
              <FormControlLabel     {...register('cold_sensation_L4_left')} value="normal" control={<Radio />} label="normal" />
              <FormControlLabel    {...register('cold_sensation_L4_left')} value="abnormal" control={<Radio />} label="abnormal" />
            </RadioGroup>
          </Stack>
        </Box>
        <Box display={currentStepIndex == 10 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Cold Sensation L4 Right</Typography>

            <RadioGroup

              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"

            >
              <FormControlLabel {...register('cold_sensation_L4_right')} value="normal" control={<Radio />} label="normal" />
              <FormControlLabel {...register('cold_sensation_L4_right')} value="abnormal" control={<Radio />} label="abnormal" />
            </RadioGroup>
          </Stack>
        </Box>
        <Box display={currentStepIndex == 11 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Cold Sensation C7 Left</Typography>

            <RadioGroup

              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"

            >
              <FormControlLabel  {...register('cold_sensation_C7_left')} value="normal" control={<Radio />} label="normal" />
              <FormControlLabel  {...register('cold_sensation_C7_left')} value="abnormal" control={<Radio />} label="abnormal" />
            </RadioGroup>
          </Stack>
        </Box>
        <Box display={currentStepIndex == 12 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='flex-start' alignItems='left'>
            <Typography variant='h4' marginBottom={20}>Cold Sensation C7 Right</Typography>

            <RadioGroup

              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"

            >
              <FormControlLabel   {...register('cold_sensation_C7_right')} value="normal" control={<Radio />} label="normal" />
              <FormControlLabel   {...register('cold_sensation_C7_right')} value="abnormal" control={<Radio />} label="abnormal" />
            </RadioGroup>
          </Stack>
        </Box>
        {/* <Box display={currentStepIndex == 1 ? 'block' : 'none'}>
          <Typography variant='h6'>Identify</Typography>
          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question1')} type='checkbox' />
              <span>{selfAssessmentQuestions.question1}</span>
            </label>
          </Stack>
          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question2')} type='checkbox' />
              <span>{selfAssessmentQuestions.question2}</span>
            </label>
          </Stack>
          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question3')} type='checkbox' />
              <span>{selfAssessmentQuestions.question3}</span>
            </label>
          </Stack>
          <Typography variant='h6'>Situation</Typography>

          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question4')} type='checkbox' />
              <span>{selfAssessmentQuestions.question4}</span>
            </label>
          </Stack>
          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question5')} type='checkbox' />
              <span>{selfAssessmentQuestions.question5}</span>
            </label>
          </Stack>
          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question6')} type='checkbox' />
              <span>{selfAssessmentQuestions.question6}</span>
            </label>
          </Stack>
          <Typography variant='h6'>Background & Assessment</Typography>

          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question7')} type='checkbox' />
              <span>{selfAssessmentQuestions.question7}</span>
            </label>
          </Stack>
          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question8')} type='checkbox' />
              <span>{selfAssessmentQuestions.question8}</span>
            </label>
          </Stack>
          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question9')} type='checkbox' />
              <span>{selfAssessmentQuestions.question9}</span>
            </label>
          </Stack>
          <Typography variant='h6'>Recommendation & Repeat</Typography>

          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question10')} type='checkbox' />
              <span>{selfAssessmentQuestions.question10}</span>
            </label>
          </Stack>
          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question11')} type='checkbox' />
              <span>{selfAssessmentQuestions.question11}</span>
            </label>
          </Stack>
          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question12')} type='checkbox' />
              <span>{selfAssessmentQuestions.question12}</span>
            </label>
          </Stack>
          <Typography variant='h6'>Order & Accuracy</Typography>

          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question13')} type='checkbox' />
              <span>{selfAssessmentQuestions.question13}</span>
            </label>
          </Stack>
          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question14')} type='checkbox' />
              <span>{selfAssessmentQuestions.question14}</span>
            </label>
          </Stack>
          <Stack direction='row' justifyContent='flex-start' alignItems='center'>
            <label className='pure-material-checkbox'>
              <input {...register('selfAssessmentAnswers.question15')} type='checkbox' />
              <span>{selfAssessmentQuestions.question15}</span>
            </label>
          </Stack>
        </Box>
        <Box display={currentStepIndex == 2 ? 'block' : 'none'}>
          <div>
            <Typography variant='h6'>What you did well?</Typography>
            <Stack direction='row' justifyContent='flex-start' alignItems='center'>
              <label className='pure-material-checkbox'>
                <input {...register('selfReflectiveAnswers.question1')} type='checkbox' />
                <span>{selfReflectiveQuestions.question1}</span>
              </label>
            </Stack>
            <Stack direction='row' justifyContent='flex-start' alignItems='center'>
              <label className='pure-material-checkbox'>
                <input {...register('selfReflectiveAnswers.question2')} type='checkbox' />
                <span>{selfReflectiveQuestions.question2}</span>
              </label>
            </Stack>
            <Stack direction='row' justifyContent='flex-start' alignItems='center'>
              <label className='pure-material-checkbox'>
                <input {...register('selfReflectiveAnswers.question3')} type='checkbox' />
                <span>{selfReflectiveQuestions.question3}</span>
              </label>
            </Stack>
            <Stack direction='row' justifyContent='flex-start' alignItems='center'>
              <label className='pure-material-checkbox'>
                <input {...register('selfReflectiveAnswers.question4')} type='checkbox' />
                <span>{selfReflectiveQuestions.question4}</span>
              </label>
            </Stack>
            <Stack direction='row' justifyContent='flex-start' alignItems='center'>
              <label className='pure-material-checkbox'>
                <input {...register('selfReflectiveAnswers.question5')} type='checkbox' />
                <span>{selfReflectiveQuestions.question5}</span>
              </label>
            </Stack>
            <Stack direction='column' justifyContent='flex-start' alignItems='center'>
              <Typography variant='h6'>{selfReflectiveQuestions.question6}</Typography>
              <TextField {...register('selfReflectiveAnswers.question6')} variant='outlined' />
            </Stack>
          </div>
        </Box>
        <Box display={currentStepIndex == 3 ? 'block' : 'none'}>
          <Stack direction='column' justifyContent='center' alignItems='center' spacing={2}>
            <Recorder setRecording={setAfterRecording} />
            <Typography variant='h5' align='center'>
              Record SBAR Briefing for the second time with the improvements
            </Typography>
          </Stack>
        </Box> */}
        {/* {currentStepIndex + 1} / {steps.length} */}
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <Stack direction={'row'} m={1} gap={1}>
            {!isFirstStep && (
              <Button size='large' fullWidth={true} variant='contained' onClick={back}>
                Back
              </Button>
            )}
            {!isLastStep && (
              <Button
                color='secondary'
                size='large'
                fullWidth={true}
                variant='contained'
                type='submit'
              // disabled={!beforeRecording}
              >
                Next
              </Button>
            )}
            {isLastStep && (
              <Button
                color='secondary'
                size='large'
                fullWidth={true}
                variant='contained'
                type='submit'
              // disabled={!afterRecording}
              >
                Finish
              </Button>
            )}
          </Stack>
        </Paper>
      </form>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        {!success && <CircularProgress color='inherit' />}
        {success && (
          <Box>
            <Alert
              iconMapping={{
                success: <CheckCircleOutlineIcon fontSize='inherit' />,
              }}
            >
              Successfully Submitted Your Attempt
            </Alert>
            <Button variant='contained' onClick={() => navigate('/')}>
              Go Back to Home
            </Button>
          </Box>
        )}
      </Backdrop>
    </Box>
  )
}

export default NewAttemptPage

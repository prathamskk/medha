import React from 'react'
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
import { CircularProgress, Stack } from '@mui/material'
import Button from '@mui/material/Button'
import selfAssessmentQuestions from '../models/selfAssessmentQuestions.json'
import selfReflectiveQuestions from '../models/selfReflectiveQuestions.json'
import Checkbox from '@mui/material/Checkbox'

const AttemptCard = (props: {
    attempt: Attempt
}) => {
    const [grade, setGrade] = useState<number>()
    async function postData(url = "", data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }


    const submissionTimestamp = props.attempt.submissionTimestamp as Timestamp
    return (
        <Card sx={{ width: '100%' }} key={props.attempt.id}>
            <CardContent>
                <Typography variant='overline'>
                    Submitted On: {submissionTimestamp.toDate().toLocaleString()}
                </Typography>
                {/* <Stack direction='column' justifyContent='center' alignItems='center' m={4}>
                    {!grade && (<Button onClick={() => {
                        postData("https://apilearnsbar.uptwocat.com/grading", { recordingLink: props.attempt.afterAssessmentRecordingLink }).then((data) => {
                            console.log(data);
                            setGrade(data)
                        });
                    }}>GET SCORE</Button>
                    )}
                    {grade && <Box>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress variant='determinate' value={grade} size={160} />
                            <Box
                                sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography
                                    variant='h5'
                                    component='div'
                                    color='text.secondary'
                                >{`${Math.round(grade)}%`}</Typography>
                            </Box>
                        </Box>
                    </Box>}

                </Stack> */}

                <Stack direction='column' justifyContent='center' alignItems='flex-start' spacing={2}>
                    {/* <Box>
                        <Typography variant='subtitle2'>Before Assessment Recording</Typography>
                        <audio controls>
                            <source src={props.attempt.beforeAssessmentRecordingLink} type='audio/mpeg' />
                            Your browser does not support the audio tag.
                        </audio>
                    </Box> */}
                    <Box width={'100%'}>
                        <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                            Name:
                            <Typography>{props.attempt.name}</Typography>
                        </Stack>
                        <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                            Age:
                            <Typography>{props.attempt.age}</Typography>
                        </Stack>
                        <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                            Gender:
                            <Typography>{props.attempt.gender}</Typography>
                        </Stack>
                        <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                            Provisional Diagnosis:
                            <Typography>{props.attempt.provisional_diagnosis}</Typography>
                        </Stack>
                        <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                            OPD Number:
                            <Typography>{props.attempt.opd_number}</Typography>
                        </Stack>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls='panel1a-content'
                                id='panel1a-header'
                            >
                                <Typography variant='h5'>Pain</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Pain L4 Left:
                                    <Typography>{props.attempt.pain_L4_left}</Typography>
                                </Stack>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Pain L4 Right:
                                    <Typography>{props.attempt.pain_L4_right}</Typography>
                                </Stack>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Pain C7 Left:
                                    <Typography>{props.attempt.pain_C7_left}</Typography>
                                </Stack>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Pain C7 Right:
                                    <Typography>{props.attempt.pain_C7_right}</Typography>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls='panel1a-content'
                                id='panel1a-header'
                            >
                                <Typography variant='h5'>Temperature</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Hot Sensation L4 Left:
                                    <Typography>{props.attempt.hot_sensation_L4_left}</Typography>
                                </Stack>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Hot Sensation L4 Right:
                                    <Typography>{props.attempt.hot_sensation_L4_right}</Typography>
                                </Stack>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Hot Sensation C7 Left:
                                    <Typography>{props.attempt.hot_sensation_C7_left}</Typography>
                                </Stack>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Hot Sensation C7 Right:
                                    <Typography>{props.attempt.hot_sensation_C7_right}</Typography>
                                </Stack>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Cold Sensation L4 Left:
                                    <Typography>{props.attempt.cold_sensation_L4_left}</Typography>
                                </Stack>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Cold Sensation L4 Right:
                                    <Typography>{props.attempt.cold_sensation_L4_right}</Typography>
                                </Stack>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Cold Sensation C7 Left:
                                    <Typography>{props.attempt.cold_sensation_C7_left}</Typography>
                                </Stack>
                                <Stack direction='row' justifyContent='flex-start' alignItems='center'>
                                    Cold Sensation C7 Right:
                                    <Typography>{props.attempt.cold_sensation_C7_right}</Typography>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default AttemptCard
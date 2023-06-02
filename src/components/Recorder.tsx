import React, { useEffect, useState } from 'react'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import MicIcon from '@mui/icons-material/Mic'
import { Stack, Box, Button } from '@mui/material'
import { WavRecorder } from "webm-to-wav-converter";
const Recorder = (props: {
  setRecording: React.Dispatch<React.SetStateAction<Blob | undefined>>
}) => {
  const { startRecording, stopRecording, recordingBlob, isRecording, recordingTime } =
    useAudioRecorder()
  const [submittedOnce, setSubmittedOnce] = useState(false)

  const ref = React.useRef();
  useEffect(() => {
    // @ts-ignore
    ref.current = new WavRecorder();
  }, []);

  return (
    <>
      <Stack direction='column' justifyContent='center' alignItems='center'>
        <p>{recordingTime}</p>
        <Box
          onClick={() => {
            if (!isRecording) {
              startRecording()
              // @ts-ignore
              ref.current.start()
            } else {
              stopRecording()
              setSubmittedOnce(true)
              // @ts-ignore
              ref.current.stop()
            }
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <Box
              bgcolor='white'
              border='solid'
              borderColor='#7852e3'
              width={150}
              height={150}
              borderRadius={'100%'}
            />
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
              <MicIcon fontSize='large' htmlColor='#7852e3' />
            </Box>
          </Box>
        </Box>
        <Button size='large' variant='contained' disabled={!submittedOnce} onClick={() => {
          // @ts-ignore
          ref.current.getBlob().then((blob) => {
            props.setRecording(blob)
          })
        }}>
          Done
        </Button>
      </Stack>
    </>
  )
}

export default Recorder

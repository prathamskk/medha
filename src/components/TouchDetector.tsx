import React, { useEffect } from 'react'
import { rtdb } from '../config/firebase'
import { ref, set, onValue } from 'firebase/database'
import touchpng from '../assets/left-click.png'
import { Stack } from '@mui/material'
const TouchDetector = () => {
    const [touchRead, setTouchRead] = React.useState(0)

    useEffect(() => {
        //read realtime database value to get reading at url /touchRead
        const touchReadRef = ref(rtdb, '/touchRead')
        const unsubscribe = onValue(touchReadRef, (snapshot) => {
            const data = snapshot.val()
            console.log(data)
            setTouchRead(data)
        })

        return () => {
            unsubscribe()
        }

    }, [])

    return (

        <Stack alignItems="center" height={250}>
            <div>Touch Detector</div>


            {touchRead <= 60 ? <><img src={touchpng} width={200} /><div>Touch Detected</div></> : <div>No Touch Detected</div>}

        </Stack>
    )
}

export default TouchDetector
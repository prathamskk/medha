import React, { useEffect } from 'react'
import { rtdb } from '../config/firebase'
import { ref, set, onValue } from 'firebase/database'
import touchpng from '../assets/left-click.png'
import { Stack } from '@mui/material'
const TouchDetector = () => {
    const [touchRead, setTouchRead] = React.useState(0)
    const [threshold, setThreshold] = React.useState(40)

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

        <Stack alignItems="center" height={300}>
            <div>Touch Detector</div>
            <div>Threshold: {threshold}</div>
            <input type="range" min={0} max={100} value={threshold} onChange={(e) => setThreshold(parseInt(e.target.value))} />


            {touchRead <= threshold ? <><img src={touchpng} width={200} /><div>Touch Detected</div></> : <div>No Touch Detected</div>}

        </Stack>
    )
}

export default TouchDetector
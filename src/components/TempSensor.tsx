import React, { useEffect } from 'react'
import { rtdb } from '../config/firebase'
import { ref, set, onValue } from 'firebase/database'
import temp from '../assets/temp.png'
import { Stack } from '@mui/material'
const TempSensor = () => {
    const [tempRead, setTempRead] = React.useState(0)

    useEffect(() => {
        //read realtime database value to get reading at url /touchRead
        const tempReadRef = ref(rtdb, '/tempRead')
        const unsubscribe = onValue(tempReadRef, (snapshot) => {
            const data = snapshot.val()
            console.log(data)
            setTempRead(data)
        })

        return () => {
            unsubscribe()
        }

    }, [])

    return (

        <Stack alignItems="center" height={250}>
            <div>Temperature Sensor</div>

            <img src={temp} width={200} />
            {tempRead}°C
        </Stack>
    )
}

export default TempSensor
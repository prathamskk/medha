import React, { useEffect } from 'react'
import { rtdb } from '../config/firebase'
import { ref, set, onValue } from 'firebase/database'
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
        <>
            <div>TouchDetector</div>
            {touchRead <= 60 ? <div>Touch Detected</div> : <div>No Touch Detected</div>}
        </>
    )
}

export default TouchDetector
import { useEffect,useState } from "react"
function TopMenu(){
    const [currentTime, setCurrentTime] = useState(new Date())
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())

        },1000)
        return () => {
            clearInterval(interval)
        }
    },[])
    return (
        <div>{currentTime.toLocaleTimeString()}</div>
    )

}

export default TopMenu

import {LineChart} from "react-native-chart-kit";
import {useEffect, useState} from "react";
import {Magnetometer} from "expo-sensors";
import FFT from "fft.js"

export default function chart(){

    const f = new FFT(1024)

    const [subscription, setSubscription] = useState(null);
    const [data, setDataNowWorking] = useState<{time:number,value:number}[]>([])

    const [displayData, setDisplayData] = useState([{
        time: 0,
        value: 0}
    ])

    const [timeStart,setTimeStart] = useState(0);
    const [timeEnd,setTimeEnd] = useState(0);

    useEffect(() => {
        Magnetometer.setUpdateInterval(1);
        const listener=Magnetometer.addListener((result)=>{
            setDataNowWorking((d)=>[{time: Date.now(),value:Math.sqrt( (result.x**2)+(result.y**2)+result.z**2)},...d])
            console.log(data)
            if(data.length == 1024){
                test()
            }
        })
        const callback = setInterval(()=>{
            /*setDisplayData(data.slice(-10))
            console.log(data)
            console.log(displayData)*/
        },1000)
        return ()=>{listener.remove()
            clearInterval(callback)}
    }, [data]);

    function test (){
        /*const storage = []
        console.log("moin")
        const inputData = f.toComplexArray(data.map((a)=>a.value),undefined)
        console.log("hi")*/
        let input = data.map(a=>a.value)
        let out = f.createComplexArray()
        f.realTransform(out,input)
        console.log(JSON.stringify( f.fromComplexArray(out,undefined)))
    }




return (
    <LineChart data={{
        labels: displayData.map(a=> a.time),
        datasets: [{
            data: displayData.map(a=>a.value),
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`
        },
            {
                data: [100],
                withDots: false
            }
        ]

    }

    } width={300} height={400} chartConfig={{backgroundColor:'red',color:(opacity = 1) => `rgba(134, 65, 244, ${opacity})`}}/>
)
}

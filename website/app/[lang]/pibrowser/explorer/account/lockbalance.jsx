'use client'
import { useSearchParams } from "next/navigation"
import { Button } from "flowbite-react";
import { useState,useEffect } from "react";
import { Server } from "stellar-sdk"

export default function LockBalance({transcript}){
    const [load,setload] = useState(null)
    const [data,setdata] = useState(null)
    const searchaccount = useSearchParams()
    const server = new Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [account,setaccount] = useState(undefined)
    console.log(transcript)
    useEffect(()=>{
        setaccount(searchaccount.get('account'))
    })
    useEffect(()=>{
        if(!account)return
        setload(null)
        setdata(null)

        server.claimableBalances()
        .claimant(account)
        .order('desc')
        .call().then(res=>{
            setload(res)
            setdata(res.records)
        })
    },[account])

    function handleClick(){
        load.next().then(
            res=>{
                setdata([...data,...res.records])
            }
        )
    }
    return(
        <>
        <div className="w-full">
            <div className="block w-full">
                <div className="overflow-hidden">
                    <table className="w-full text-center table-auto">
                        <thead className="border-b bg-gray-50 w-full">
                            <tr>
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                                {transcript.Sponsor}
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                            {transcript.Balance}
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                            {transcript.Start}
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                            {transcript.Until}
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data!=null && data.map((data,index)=>{
                                    return(categorybalance(data,index))
                                })
                            }
                        
                        </tbody>
                    </table>
                </div>
             </div>
            <div className="mt-2">
                {data != null && load.records.length >= 10 &&
                    <Button onClick={handleClick} gradientDuoTone="purpleToBlue" className="w-52 m-auto" pill={true}>Load More</Button>
                }   
            </div>
        </div>
        </>
    )
}

function categorybalance(data,index){
    let date = new Date(data.last_modified_time)
    let start = `${date.getUTCFullYear()}/${date.getUTCMonth()}/${date.getUTCDate()} ${date.getUTCHours()} : ${date.getUTCMinutes()}`
    let enddate = new Date(data.claimants[1].predicate.not.abs_before)
    let end = `${enddate.getUTCFullYear()}/${enddate.getUTCMonth()}/${enddate.getUTCDate()} ${enddate.getUTCHours()} : ${enddate.getUTCMinutes()}`
    return (
        <tr key={index} className="bg-white border-b">
        <td className="px-2 py-4 text-sm font-medium text-gray-900">{data.sponsor.substring(0,4)}</td>
        <td className="text-sm text-gray-900 font-light px-2 py-4 break-words">
            {data.amount} Pi
        </td>
        <td className="text-sm text-gray-900 font-light px-2 py-4 break-words">
            {start}
        </td>
        <td className="text-sm text-gray-900 font-light px-2 py-4 break-words">
            {end}
        </td>
        </tr> 
    )
}
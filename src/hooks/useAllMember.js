
import axios from 'axios'
import React, { useState } from 'react'

export default function useAllMember() {
    const [showAllMember, setShowAllMember] = useState([])

    const getAllMenber = async () => {
        let res = await axios.get('https://tron.betterlogics.tech/api/v1/get_Candidate')
        res = res.data
        console.log(res);
        if (res.success == true) {
            setShowAllMember(res.data)
        }
    }
    return [showAllMember, getAllMenber]

}

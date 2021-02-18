import React, {useState, useEffect} from 'react';

import RenderIGCard from './IGCard';

import * as waxjs from "@waxio/waxjs/dist";


const wax = new waxjs.WaxJS(process.env.REACT_APP_WAX_RPC, null, null, false);

export default function RenderIGInfo(props) {

    const [igInfoList, setIGInfoList] = useState([]);


    useEffect(()=>{

        async function getIGInfo(){
            try{
                let resp = await wax.rpc.get_table_rows({
                    code: "oig",
                    scope: 'oig',
                    table: 'igs',
                    limit: 100,
                    json: true
                });
                if(resp.rows.length){
                    setIGInfoList(resp.rows);
                } else {
                    setIGInfoList([]);
                }
                console.log(resp.rows);
            } catch(e){
                console.log(e);
            }
        }

        getIGInfo();

    }, []);

    return (
        <div>
            {
                igInfoList.length ? 
                <h1>Current IGs:</h1>
                : "" 
            }
            {igInfoList.map((igInfo, index) => {
                return(<div key={index}><RenderIGCard igInfo={igInfo} /></div>)
            })}
        </div>
    )

}
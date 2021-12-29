/** @jsx jsx */

import {useState, useEffect} from 'react';
import { jsx } from '@emotion/react';
import * as waxjs from "@waxio/waxjs/dist";

import RenderIGCard from './IGCard';

import * as GLOBAL_STYLE from '../theme';


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
        <div css={{
            padding: `0 ${GLOBAL_STYLE.spacing.s}`,
            marginTop: GLOBAL_STYLE.spacing.xl,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {
                igInfoList.length ?
                <GLOBAL_STYLE.H2>Current IGs</GLOBAL_STYLE.H2>
                : ""
            }
            {igInfoList.map((igInfo, index) => {
                return(<div key={index}><RenderIGCard igInfo={igInfo} /></div>)
            })}
        </div>
    )

}
import React from 'react';

export default function RenderIGCard(props){
    
    return (
        <div>
            <img src={props.igInfo.picture} style={{maxWidth: 500}} alt="IG"></img>
            <h5><label>Name: </label>{props.igInfo.name}</h5>
            <h5><label>Account: </label>{props.igInfo.account}</h5>
            <h5><label>Description: </label>{props.igInfo.descriptor}</h5>
            <h5><label>Term began: </label>{props.igInfo.term[0]}</h5>
            <h5><label>Term ends: </label>{props.igInfo.term[1]}</h5>
            <hr></hr>
        </div>
    )
}
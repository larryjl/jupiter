import React, { useState } from 'react'
import './callStack.css'
import { ReactComponent as ClearSvg } from "../../images/btnClear.svg";
import { ReactComponent as RunSvg } from "../../images/btnRun.svg";
import { ReactComponent as DeleteSvg } from "../../images/btnDelete.svg";



export function CallCard(props) {
    const Svg = props.image

    function handleClick() {
        props.deleteItem(props.id);
    }
    
    return(
        <div className="calling-card" id={props.id} key = {props.id}>
            <Svg 
                className="cardIcon"
            />
            <p>{props.desc}</p>
            <button className="delete-button iconBtn" onClick={handleClick}>
            <DeleteSvg className="deleteIcon"></ DeleteSvg>
            </button>
        </div>
    )
}


export function CallStack(props) {

    // const runStack = () => {
    //     console.log(props.callStackComps.length)
    //     props.callStackComps.forEach(i => i.props.fx(i.props.para))
    //     // let i
    //     // for(i = 0; i=props.callStackComps.length; i++){
    //     //     console.log(props.callStackComps[i])
    //     // }
    //     // let item
    //     // for(item in props.callStackComps) {
    //     //     console.log(item)
    //     // }
    // }
    return(
        <div  className='call-stack' >
            <div className='cards-div'>
                {props.callStackComps}
            </div>
            <div className='buttons-div'>
            <button 
                id='clear-button' 
                name="clear-button"
                key="clear-button"
                className="iconBtn"
                onClick={props.clearStack}
            >
                <ClearSvg
                    className="clearIcon" 
                    alt="Clear Button"
                />
            </button>
            <button 
                id='run-button' 
                name="run-button"
                key="run-button"
                className="iconBtn"
                onClick={props.runStack}
            >
                <RunSvg
                    className="runIcon" 
                    alt="Run Button"
                />
            </button>
            </div>
        </div>
    )
}

// export default {CallStack, CallCard}
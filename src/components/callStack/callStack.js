import React, { useState } from 'react'
import './callStack.css'
import { ReactComponent as ClearSvg } from "../../images/btnClear.svg";
import { ReactComponent as RunSvg } from "../../images/btnRun.svg";



export function CallCard(props) {

    const Svg = props.image
    return(
        <div className="calling-card" id={props.id} key = {props.id}>
            <Svg 
                className="cardIcon"
            />
            <p>{props.desc}</p>
            {/* <button>X</button> */}
        </div>
    )
}


export function CallStack(props) {
    return(
        <div  className='call-stack'>
            {props.callStackComps}
            <div className='button-div'>
            <button id='clear-button' onClick={props.clearStack}>
                <ClearSvg 
                    className="iconBtn"
                    alt="Clear Button"
                />
            </button>
            <button id='run-button'>
                <RunSvg 
                    className="iconBtn"
                    alt="Run Button"
                />
            </button>
            </div>
        </div>
    )
}

// export default {CallStack, CallCard}
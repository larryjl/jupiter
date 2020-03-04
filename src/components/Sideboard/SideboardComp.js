import React, { useState } from 'react';
import './Sideboard.css'
import Translation from '../translation/translationComp'
import Rotation from '../rotation/rotationComp'
import Reflection from '../reflection/reflectionComp'
import { ReactComponent as TranslationSvg } from "../../images/btnTrans.svg";
import { ReactComponent as RotationSvg } from "../../images/btnRot.svg";
import { ReactComponent as ReflectionSvg } from "../../images/btnReflect.svg";

function Sideboard(props) {
    const [tab, setTab] = useState(null)

    function handleClick(e) {
        if(e.currentTarget.id === "translation-button"){
            setTab("translation")
        }else if(e.currentTarget.id === "reflection-button"){
            setTab("reflection")
        }else if(e.currentTarget.id === "rotation-button"){
            setTab("rotation")
        }
    };

    return (
        <div id="sideboard">
            <nav>
                <button id="translation-button" className='tab-button' onClick = {handleClick}>
                    <TranslationSvg 
                        alt="Translation"
                    />
                </button>
                <button id="rotation-button" className='tab-button' onClick = {handleClick}>
                    <RotationSvg 
                        alt="Rotation"
                    />
                </button>
                <button id="reflection-button" className='tab-button' onClick = {handleClick}>
                    <ReflectionSvg
                        alt="Reflection"
                    />
                </button>
            </nav>
            {tab === 'translation' &&  
                <Translation 
                    translate = {props.translate}
                    translationFactor = {props.translationFactor}
                    handleChange = {props.handleChange}
                />
            }
            {tab === 'rotation' &&  
                <Rotation 
                    rotate={props.rotate}
                    pivotPointx={props.pivotPointx}
                    pivotPointy={props.pivotPointy}
                    rotationMag ={props.rotationMag}
                    handleChange = {props.handleChange}
                />
            }
            {tab === 'reflection' &&  
                <Reflection 
                    reflect={props.reflect}
                    lineOfReflection={props.lineOfReflection}
                    handleChange = {props.handleChange}
                />
            }
        </div>
    )
}

export default Sideboard;
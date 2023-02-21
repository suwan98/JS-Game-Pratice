import {makeDOMwithProperties} from "../utils/dom.js"
import { isGameStart, setTimer, startTimer, stopTimer } from '../utils/timer.js';

let boxDOMList = [];
let wallBoxDOMList = [];
let startBoxDOM = null;
let endBoxDOM = null;

const gameFieldDOM = document.getElementById('game-field');
const handleSucessGame = () => {
    stopTimer();
    setTimer(0);
};
const handleFalledGame = () => {
    stopTimer();
    //실패 -> 타이머를 멈추고, 모달을 띄우기 
    setTimer(0);

};

export const setBoxDOM = ({
    row,  //열이 몇갠지
    col, //행이 몇갠지
    start, //시작 위치
    end, //종료 위치
    walls, //벽의 위치)
}) =>{

    const controlBoxContainer = makeDOMwithProperties('div', {
        id : 'control-box-container',
        onmouseleave : () => {
            if(!isGameStart) return;

            handleFalledGame();
            //게임시작 변수가 세팅
        }
    });
    controlBoxContainer.style.display = 'grid';
    controlBoxContainer.style.gridTemplateRows = `repeat(${row},1fr)`;
    controlBoxContainer.style.gridTemplateColumns = `repeat(${col},1fr)`;
    
    for(let i=0; i<row; i++){
        for(let j=0; j<col; j++){
            const { type ,className, innerHTML = ''} = (function (){
                if (i === start[0] && j === start[1]) return {
                    type: 'start',
                    className: 'control-box start',
                    onmouseover: (event) => {
                      startTimer(() => {
                        handleFailedGame();
                      });
                      event.target.innerHTML = '';
                    },
                    innerHTML: '시작',
                  };
                if (i === end[0] && j === end[1]){
                    return {
                        type : 'end',
                        className : 'control-box end',
                        innerHTML : '끝',
                        onmouseover : () => {
                            if(!isGameStart) return;
                            event.target.innerHTML = '';
                            handleSucessGame();
                        }
                    };
                }
                for (let wall of walls){
                    if (i === wall[0] && j === wall[1]){
                        return {
                            type : 'wall',
                            className : 'control-box wall',
                            onmouseover : () => {
                                //게임 끝 -> 타이머 종료 , 실패 모달
                                if(!isGameStart) return;

                                handleFalledGame();
                            }
                        };
                    }
                }
                return {
                    type : 'normal',
                    className : 'control-box',
                    onmouseover : () => {
                    }
                }
            }()); 
            const boxDOM = makeDOMwithProperties('div',{
                className,
                innerHTML,
                id : `box-${i}-${j}`,
                onmouseover,
            });

            switch(type){
                case 'start' :
                    startBoxDOM = boxDOM;
                    break;
                case  'end' :
                    endBoxDOM = boxDOM;
                    break;
                case 'wall' :
                    wallBoxDOMList.push(boxDOM);
                    break;
                default :
                    boxDOMList.push(boxDOM);
            }

            controlBoxContainer.appendChild(boxDOM);
        }
    }
    gameFieldDOM.appendChild(controlBoxContainer);
};
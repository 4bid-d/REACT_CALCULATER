import React, {useReducer}  from 'react'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

import "./style.css"

export const ACTIONS = {
  ADD_DIGIT : "add-digit",
  DELETE_DIGIT : "remove-digit",
  CLEAR  : "clear",
  CHOOSE_OPERATION : "choose-operation",
  EVALUATE : "evaluate"
}

function reducer(state ,{ type, payload}){
    switch(type){
      case ACTIONS.ADD_DIGIT:
        
        if(state.currentOperend === "0" && payload.digit === "0") return state
        if(payload.digit === "." && state.currentOperend.includes(".")){ 
          return state
        } 
        if(state.overWrite){
          return {
            ...state,
            currentOperend: payload.digit,
            overWrite: false,
          }
        }
        return {
          ...state,
          currentOperend: `${state.currentOperend || ""}${payload.digit}`
        }
      case ACTIONS.DELETE_DIGIT:
        if(state.overWrite){
          return {
            overWrite:false,
            currentOperend:null
          }
        }
        if(!state.currentOperend){
          return {}
        }
        return {
            ...state,
            currentOperend: state.currentOperend.slice(0, -1) 
          } 
      case ACTIONS.CLEAR: 
          return {}

      case ACTIONS.CHOOSE_OPERATION: 
        if(state.currentOperend == null && state.previousOperend == null ) return state
        if(state.previousOperend == null){
              return {
                ...state,
                previousOperend: state.currentOperend,
                operation : payload.operation,
                currentOperend: ``
              } 
        }
        if(state.operation != null && state.currentOperend == ''){
          return{
            ...state,
            operation: payload.operation,
          }
        }
        if(state.currentOperend == null){
          return {
            ...state,
            previousOperend: state.previousOperend,
            operation: payload.operation
          }
        }
        return{
          ...state,
          previousOperend: evaluate(state),
          operation:payload.operation,
          currentOperend: '',
        } 
      case ACTIONS.EVALUATE :
        if(state.currentOperend == null ||
          state.previousOperend == null ||
          state.operation == null)
          {
            alert("Enter a valid input.")
            return {} 
          }
        return{
          ...state,
          previousOperend: null,
          operation:"",
          overWrite : true,
          currentOperend : evaluate(state)
        }
          
    }
  }

function evaluate({currentOperend , previousOperend , operation}){
    const prev = parseFloat(previousOperend)
    const current = parseFloat(currentOperend)
    if(isNaN(prev) || isNaN(current ) ) return ""
    let computation = ''
    switch(operation){
      case "+":
        computation = prev+ current
        break
      case "-":
        computation = prev- current
        break
      case "/":
        computation = prev / current
        break
      case "*":
        computation = prev * current
        break
    }
    return computation.toString()
}
const INDEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0
})
function formatOperand(operand){
  if(operand == null) return 
  const [integer ,decimal] = operand.split(".")
  if(decimal == null) return INDEGER_FORMATTER.format(integer)
  return `${INDEGER_FORMATTER.format(integer)}.${decimal}`
}
function App() {
  const [{currentOperend , previousOperend , operation} , dispatch] = useReducer(
    reducer , {})
 return (  
    <>
  <div className="calculater-grid">
    <div className="output">
      <div className="previous-operand">
      {formatOperand(previousOperend)} {operation}
      </div>
      <div className="current-operand" >{formatOperand(currentOperend)}</div>
    </div>
    <button className="span-two" onClick={()=> dispatch({type:ACTIONS.CLEAR })} >AC</button>
    
    <button onClick={()=> dispatch({type:ACTIONS.DELETE_DIGIT })}>DEL</button>
    <OperationButton operation={"/"} dispatch={dispatch}/>
    <DigitButton digit="1" dispatch={dispatch} />
    <DigitButton digit="2" dispatch={dispatch} />
    <DigitButton digit="3" dispatch={dispatch} />
    <OperationButton operation={"*"} dispatch={dispatch}/>
    <DigitButton digit="4" dispatch={dispatch} />
    <DigitButton digit="5" dispatch={dispatch} />
    <DigitButton digit="6" dispatch={dispatch} />
    <OperationButton operation={"+"} dispatch={dispatch}/>
    <DigitButton digit="7" dispatch={dispatch} />
    <DigitButton digit="8" dispatch={dispatch} />
    <DigitButton digit="9" dispatch={dispatch} />
    <OperationButton operation={"-"} dispatch={dispatch}/>
    <DigitButton digit="." dispatch={dispatch} />
    <DigitButton digit="0" dispatch={dispatch} />
    <button className='span-two' onClick={()=> dispatch({type:ACTIONS.EVALUATE })} >=</button>
  </div>
    </>
  )

}

export default App;

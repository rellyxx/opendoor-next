import React, { useReducer, useContext } from 'react'
const intialState = {
    a: "1111",
    b: "22222"
}
const reducer = (prevState: any, action: { type: any; payload:any }) => {
    let newState = { ...prevState }
    switch (action.type) {
        case "child2":
            newState.a = action.payload;
            return newState;
        case "child3":
            newState.b = action.payload;
            return newState;
        default: return newState;
    }

}
const GlobalContext = React.createContext({})
export default function app() {
    const [state, dispatch] = useReducer(reducer, intialState)
    return (
        <GlobalContext.Provider value={
            {
                state: state,
                dispatch: dispatch
            }
        }>
            <div>
                <Child1></Child1>
                <Child2></Child2>
                <Child3></Child3>
            </div>
        </GlobalContext.Provider>)
}

function Child1() {
    const value:any = useContext(GlobalContext)
    return (<div>
        <button onClick={() => {
            value.dispatch({ type: "child2",payload:'ppppppp' })
        }}>改变child2</button>
        <button onClick={() => {
            value.dispatch({ type: "child3" })
        }}>改变child3</button>
    </div>
    )
}

function Child2() {
    const value:any = useContext(GlobalContext)
    return (
        <div style={{ background: "yellow" }}>
            Child2 {value.state.a}
        </div>
    )
}

function Child3() {
    const value:any = useContext(GlobalContext)
    return (
        <div style={{ background: "blue" }}>
            Child3  {value.state.b}
        </div>

    )
}
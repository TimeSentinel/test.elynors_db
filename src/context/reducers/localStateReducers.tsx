/* REDUCERS
################################### Restaurant Functional Module ###################################
/src/reducer/localStateReducers.tsx    ::: Reducers for local storage state,
REQ: Vite-React.js+TypeScript, react-router-dom, react-hot-toast,
(c)2024 Lance Stubblefield
####################################################################################################
*/

import React, {useEffect, useReducer} from "react";

//region ---vv-------- interfaces --------vv---
export interface LocalStateInterface {
    shoppingCart: CartInterface;    // Cart Module
    cssUUID: string;  // Themes Module
}

export interface LocalActionInterface {
    type: string;
    payload: unknown;
}

interface CartReducerInterface {    // Cart Module
    prodid: string;
    quantity: number;
    items: [
        itemid: string
    ]
}

interface CartInterface {           // Cart Module
    [id: string]: number;
}

export const initialLocalState: LocalStateInterface = {
    shoppingCart: {},  //Cart Module
    cssUUID: "bb070233-683f-43c5-9c9d-d4a0ecefddc7", //update with default UUID for theme
}
//endregion
// ------------------------------------------------

export const useLocalStorage: (storageKey: string) => [LocalStateInterface, React.Dispatch<LocalActionInterface>] = (storageKey: string) => {
    const [value, setValue] = useReducer(localReducerFn,
        JSON.parse(localStorage.getItem(storageKey) || JSON.stringify(initialLocalState)) as LocalStateInterface
    );

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(value));
    }, [value, storageKey]);

    return [value, setValue];
};

const localReducerFn = (state: LocalStateInterface, action: LocalActionInterface) => {
    // console.log("localReducerFN")
    const {type, payload} = action
    switch (type) {
        case "ADD_TO_CART": {                   // Cart Module
            const newCart = state.shoppingCart
            if (!((payload as CartReducerInterface).prodid in newCart))
                newCart[(payload as CartReducerInterface).prodid] = 1;

            return {
                ...state,
                shoppingCart: newCart as CartInterface
            }
        }

        case "UPDATE_CART": {                   // Cart Module
            const newCart = state.shoppingCart
            if ((payload as CartReducerInterface).prodid in newCart) {
                newCart[(payload as CartReducerInterface).prodid] = (payload as CartReducerInterface).quantity;
            } else {
                newCart[(payload as CartReducerInterface).prodid] = 1;
            }
            return {
                ...state,
                shoppingCart: (newCart as CartInterface)
            }
        }
        case "REMOVE_ITEM": {                   // Cart Module
            const newCart = state.shoppingCart
            delete newCart[(payload as CartReducerInterface).prodid]
            return {
                ...state,
                shoppingCart: (newCart as CartInterface)
            }
        }
        case "EMPTY_CART":                      // Cart Module
            console.log("EMPTY_CART")

            return {
                ...state,
                shoppingCart: {}
            }
        case "CSS_UUID":                        // Themes Module
            return  {
                ...state,
                cssUUID: (payload as string)
            }
        default:
            return state
    }
}



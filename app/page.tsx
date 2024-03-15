'use client'
import { Provider } from "react-redux"
import { store } from "./store"
import Home from "./home"

export default function MainPage(){
    return <main>
        <Provider store={store}>
            <Home />
        </Provider>
    </main>
}
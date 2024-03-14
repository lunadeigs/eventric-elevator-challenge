import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { Direction, ElevatorState, FloorState } from "./elevatorTypes";

const initialState:ElevatorState = {
    currentFloor: 1,
    destinationFloor: 1,
    direction: Direction.IDLE,
    floorState: FloorState.CLOSED,
    passengerQueue: [],
    requestQueue: []
}

const elevatorSlice = createSlice({
    name: 'elevator',
    initialState,
    reducers: {
        pickUp: (state) => {
            // Picks up tenants on floor with matching direction
        },
        dropOff: (state) => {
            // Drops off tenants on floor with matching direction
        },
        addRequest: (state, action:PayloadAction) => {
            // Adds a new tenant to the requestQueue
        },
        nextFloor: (state) => {
            // Increments/Decrements floor according to direction
        },
        updateDirection: (state) => {
            // Sets new direction according to current state
        },
        stepFloorState: (state) => {
            // Moves floor state to the next logical option (i.e => close door to leaving)
        }
    }
})

const store = configureStore({
    reducer: elevatorSlice.reducer,
})

export type RootState = ReturnType<typeof store.getState>

export default store
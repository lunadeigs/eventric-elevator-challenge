import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { Direction, ElevatorState, FloorState, Tenant } from "./elevatorTypes";

const initialState:ElevatorState = {
    currentFloor: 1,
    destinationFloor: 1,
    direction: Direction.IDLE,
    floorState: FloorState.CLOSED,
    passengerQueue: [],
    requestQueue: [{
        name: "Another Person",
        destinationFloor: 6,
        direction: Direction.UP,
        startingFloor: 5,
        requestTime: new Date('December 17, 1995 03:24:01').toString()
    }],
    spawnTimer: 0
}

function incrementSpawnTimer(prev:number){
    if(prev === 9){
        return 0
    }else{
        return prev + 1
    }
}

const elevatorSlice = createSlice({
    name: 'elevator',
    initialState,
    reducers: {
        pickUp: (state) => {
            // Picks up tenants on floor with matching direction
            const newPassengers = state.requestQueue.filter(tenant => (
                tenant.direction === state.direction && 
                tenant.startingFloor === state.currentFloor
            ))
            const updatedPassengerQueue = [...newPassengers, ...state.passengerQueue]

            state.requestQueue = state.requestQueue.filter(tenant => !(
                tenant.direction === state.direction && 
                tenant.startingFloor === state.currentFloor
            ))

            state.passengerQueue = updatedPassengerQueue.sort((a, b) => {
                if(a.destinationFloor > b.destinationFloor){
                    return state.direction === Direction.DOWN ? -1 : 1
                }
                
                return state.direction === Direction.DOWN ? 1 : -1
            })
            state.spawnTimer = incrementSpawnTimer(state.spawnTimer)
        },
        dropOff: (state) => {
            // Drops off tenants on floor with matching direction
            state.passengerQueue = state.passengerQueue.filter(tenant => tenant.destinationFloor !== state.currentFloor)
            state.spawnTimer = incrementSpawnTimer(state.spawnTimer)
        },
        addRequest: (state, action:PayloadAction<Tenant>) => {
            // Adds a new tenant to the requestQueue
            state.requestQueue.push(action.payload)
            state.spawnTimer = incrementSpawnTimer(state.spawnTimer)
        },
        nextFloor: (state) => {
            // Increments/Decrements floor according to direction
            if(state.direction !== Direction.IDLE){
                state.currentFloor += state.direction === Direction.UP ? 1 : -1
                state.floorState = FloorState.ARRIVING
            }
            state.spawnTimer = incrementSpawnTimer(state.spawnTimer)
        },
        updateDirection: (state) => {
            // Sets new direction according to current state
            if(state.passengerQueue.length > 0){
                state.direction = state.passengerQueue[0].direction
            }else{
                const currentFloorTenants = state.requestQueue.filter(tenant => tenant.startingFloor === state.currentFloor)
                if(currentFloorTenants.length > 0){
                    state.direction = currentFloorTenants[0].direction
                }else{
                    if(state.requestQueue.length > 0){
                        const floorDifference = state.currentFloor - state.requestQueue[0].startingFloor
                        if(floorDifference > 0){
                            state.direction = Direction.DOWN
                        }else{
                            state.direction = Direction.UP
                        }
                    }else{
                        state.direction = Direction.IDLE
                    }
                }
            }
            state.spawnTimer = incrementSpawnTimer(state.spawnTimer)
        },
        updateDestination: (state) => {
            // Sets new destination floor according to previous state
            if(state.passengerQueue.length > 0){
                state.destinationFloor = state.passengerQueue[0].destinationFloor
            }else if(state.requestQueue.length > 0){
                state.destinationFloor = state.requestQueue[0].startingFloor
            }else{
                state.destinationFloor = state.currentFloor
            }

            if(state.destinationFloor > state.currentFloor){
                state.direction = Direction.UP
            }else if(state.destinationFloor < state.currentFloor){
                state.direction = Direction.DOWN
            }else{
                state.direction = Direction.IDLE
            }
            state.spawnTimer = incrementSpawnTimer(state.spawnTimer)
        },
        stepFloorState: (state) => {
            // Moves floor state to the next logical option (i.e => close door to leaving)
            switch(state.floorState){
                case FloorState.ARRIVING:
                    let shouldStop = false
                    
                    if(state.passengerQueue.find(tenant => tenant.destinationFloor === state.currentFloor) !== undefined){
                        shouldStop = true
                    }

                    if(state.requestQueue.find(tenant => (
                        tenant.startingFloor === state.currentFloor
                        && tenant.direction === state.direction
                    )) !== undefined){
                        shouldStop = true
                    }

                    if(shouldStop){
                        state.floorState = FloorState.STOPPING
                    }else{
                        state.floorState = FloorState.LEAVING
                    }

                    break
                case FloorState.STOPPING:
                    state.floorState = FloorState.OPEN
                    break
                case FloorState.OPEN:
                    state.floorState = FloorState.CLOSED
                    break
                case FloorState.CLOSED:
                    if(state.direction !== Direction.IDLE){
                        state.floorState = FloorState.LEAVING
                    }

                    break
                case FloorState.LEAVING:
                    state.floorState = FloorState.ARRIVING

                    break
            }
            state.spawnTimer = incrementSpawnTimer(state.spawnTimer)
        }
    }
})

const test = elevatorSlice.reducer

export const {pickUp, dropOff, addRequest, nextFloor, updateDirection, updateDestination, stepFloorState} = elevatorSlice.actions

export const store = configureStore({
    reducer: elevatorSlice.reducer
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
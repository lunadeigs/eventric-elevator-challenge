'use client'
import { DateTime } from "luxon"
import { Direction, ElevatorState, FloorState, Tenant } from "./elevatorTypes"
import PassengerList from "./passengerList"
import PendingRequestsList from "./pendingRequestsList"
import ElevatorControl from "./elevatorControl"
import { useEffect, useState } from "react"
import { RootState, AppDispatch, pickUp, nextFloor, dropOff, updateDestination, updateDirection, stepFloorState, addRequest } from "./store"
import { useAppDispatch, useAppSelector } from "./reduxHooks"
import { uniqueNamesGenerator, names } from "unique-names-generator"

function validateDirection(elevatorState:ElevatorState){
    if(elevatorState.passengerQueue.length > 0){
        return elevatorState.direction === elevatorState.passengerQueue[0].direction
    }

    const currentFloorTenants = elevatorState.requestQueue.filter(tenant => tenant.startingFloor === elevatorState.currentFloor)
    if(currentFloorTenants.length > 0){
        return elevatorState.direction === currentFloorTenants[0].direction
    }

    if(elevatorState.requestQueue.length > 0){
        const floorDifference = elevatorState.currentFloor - elevatorState.requestQueue[0].startingFloor
        if(floorDifference > 0){
            return elevatorState.direction === Direction.DOWN
        }

        return elevatorState.direction === Direction.UP
    }
    
    return elevatorState.direction === Direction.IDLE
}

function validateDestination(elevatorState:ElevatorState){
    if(elevatorState.passengerQueue.length > 0){
        return elevatorState.destinationFloor === elevatorState.passengerQueue[0].destinationFloor
    }
    
    if(elevatorState.requestQueue.length > 0){
        return elevatorState.destinationFloor === elevatorState.requestQueue[0].startingFloor
    }

    return elevatorState.destinationFloor === elevatorState.currentFloor
}

function floorHasPickup(elevatorState:ElevatorState){
    return elevatorState.requestQueue.find(tenant => (
        tenant.startingFloor === elevatorState.currentFloor
        && tenant.direction === elevatorState.direction
    )) !== undefined 
}

function buildRandomTenant():Tenant{
    const startingFloor = Math.floor(Math.random() * 20) + 1;
    let destinationFloor = Math.floor(Math.random() * 20) + 1;
    const newName = uniqueNamesGenerator({
        dictionaries: [names]
    })
    
    if(destinationFloor === startingFloor){
        if(destinationFloor < 10){
            destinationFloor += 1
        }else{
            destinationFloor -= 1
        }
    }

    return {
        destinationFloor: destinationFloor,
        direction: startingFloor > destinationFloor ? Direction.DOWN : Direction.UP,
        name: newName,
        requestTime: DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS),
        startingFloor: startingFloor
    }
}

function useElevator(){
    const elevatorState = useAppSelector(state => state)
    const elevatorDispatch = useAppDispatch()

    useEffect(() => {
        let ignore = false

        console.log(elevatorState)

        if(elevatorState.spawnTimer === 10){
            elevatorDispatch(addRequest(buildRandomTenant()))
        }else{
            setTimeout(() => {
                if(!ignore){
                    switch(elevatorState.floorState){
                        case FloorState.ARRIVING:
                            elevatorDispatch(stepFloorState())
                            break
                        case FloorState.STOPPING:
                            elevatorDispatch(stepFloorState())
                            break
                        case FloorState.OPEN:
                            if(elevatorState.passengerQueue.find(tenant => tenant.destinationFloor === elevatorState.currentFloor)){
                                elevatorDispatch(dropOff())
                            }else if(!validateDirection(elevatorState)){
                                elevatorDispatch(updateDirection())
                            }else if(floorHasPickup(elevatorState)){
                                elevatorDispatch(pickUp())
                            }else{
                                elevatorDispatch(stepFloorState())
                            }
                            break
                        case FloorState.CLOSED:
                            if(!validateDestination(elevatorState)){
                                elevatorDispatch(updateDestination())                    
                            }else{
                                elevatorDispatch(stepFloorState())
                            }
                            break
                        case FloorState.LEAVING:
                            elevatorDispatch(nextFloor())
                            break
                    }
                }
            }, 1000)
        }

        return(() => {
            ignore = true
        })
    })

    return elevatorState
}

function PageWrapper(props:{
    children:React.ReactNode;
}){
    return <div className="page">
        <div className="page-wrapper">
            <div className="page-body">
                <div className="container-xl">
                    <div className="row row-deck row-cards">
                        { props.children }
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default function Home(){
    // const DUMMY_REQUESTS:Pick<Tenant, 'direction' | 'requestTime' | 'startingFloor'>[] = [
    //     {
    //         direction: Direction.UP,
    //         startingFloor: 10,
    //         requestTime: new Date('December 17, 1995 03:24:00').toString()
    //     },
    //     {
    //         direction: Direction.UP,
    //         startingFloor: 8,
    //         requestTime: new Date('December 17, 1995 03:24:01').toString()
    //     },
    //     {
    //         direction: Direction.DOWN,
    //         startingFloor: 2,
    //         requestTime: new Date('December 17, 1995 03:24:02').toString()
    //     },
    //     {
    //         direction: Direction.UP,
    //         startingFloor: 18,
    //         requestTime: new Date('December 17, 1995 03:24:03').toString()
    //     },
    //     {
    //         direction: Direction.DOWN,
    //         startingFloor: 5,
    //         requestTime: new Date('December 17, 1995 03:24:04').toString()
    //     }
    // ]

    const elevator = useElevator()

    return <PageWrapper>
            <PassengerList 
                elevatorPassengers={elevator.passengerQueue}
            />
            <ElevatorControl
                {...elevator}
            />
            <PendingRequestsList
                pendingTenants={elevator.requestQueue}
                spawnTimer={elevator.spawnTimer}
            />
    </PageWrapper>
}
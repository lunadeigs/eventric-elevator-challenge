import { DateTime } from "luxon"

export enum Direction {
    DOWN=0,
    UP,
    IDLE
}

export enum FloorState{
    ARRIVING=0,
    STOPPING,
    OPEN,
    CLOSED,
    LEAVING
}

export interface Tenant{
    destinationFloor: number
    direction: Direction.DOWN | Direction.UP
    name: string
    requestTime: string
    startingFloor: number
}

export interface ElevatorState{
    currentFloor: number
    destinationFloor: number
    direction: Direction
    floorState: FloorState
    passengerQueue: Tenant[]
    requestQueue: Tenant[]
    spawnTimer: number
}
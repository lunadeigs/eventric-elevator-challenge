'use client'

import { IconArrowDown, IconDoor, IconDoorEnter, IconMinus } from "@tabler/icons-react"
import { Direction, ElevatorState, FloorState, Tenant } from "./elevatorTypes"
import CardWrapper from "./cardWrapper"

function ElevatorDisplayArrow(props:Pick<ElevatorState, 'direction' | 'floorState'>){
    return <div className="col col-4 text-center">{ /* If there's time, rewrite this cause it's very wordy even though it functions */
        props.direction === Direction.IDLE ? 
            <IconMinus className="text-yellow icon icon-lg"/>
            : props.floorState === FloorState.ARRIVING || props.floorState === FloorState.LEAVING ?
                props.direction === Direction.DOWN ?
                    <IconArrowDown className="text-red icon icon-lg" />
                    : <IconArrowDown className="text-green icon icon-lg" />
                : props.direction === Direction.UP ?
                    <IconArrowDown className="text-red icon icon-lg" />
                    : <IconArrowDown className="text-green icon icon-lg" />
    }</div>
}

function ElevatorDisplayDoor(props:Pick<ElevatorState, 'floorState'>){
    return <div className="col col-4 text-center">{
        props.floorState === FloorState.OPEN ?
            <IconDoorEnter className="text-green icon-lg" />
            :
            <IconDoor className="icon icon-lg"/>
    }</div>
}

function ElevatorDisplay(props:Pick<ElevatorState, 'currentFloor' | 'direction' | 'floorState'>){
    return <div className="card card-sm">
        <div className="card-body">
            <div className="row justify-content-around">
                <ElevatorDisplayDoor {...props} />

                <div className="col col-4 text-center my-auto mx-auto px-auto py-auto" style={{
                    fontSize: "300%"
                }}>
                    {props.currentFloor}
                </div>
                
                <ElevatorDisplayArrow {...props} />
            </div>
        </div>
    </div>
}

function ElevatorPanelButton(props:{
    pressed:boolean
    floorNumber: number
}){ /* FIXME - Need to remove the on hover effect so it's not confusing when using */
    return <div className="col col-auto text-center">
        <span 
            className={`btn btn-icon cursor-default ${props.pressed ? "btn" : "btn-outline"}-yellow`}
            style={{
                
            }}
        >{props.floorNumber}</span>
    </div>
}

function ElevatorPanelRow(props:{
    startFloor: number,
    pressedFloors: number[]
}){
    return <div className={`col col-12 ${props.startFloor === 16 ? 'mb-3' : props.startFloor === 1 ? 'bt-3' : 'my-3'}`}>
        <div className="row row-deck justify-content-evenly">{
            Array.from(Array(5).keys()).map(val => {
                const floorNumber = val + props.startFloor

                return <ElevatorPanelButton
                    pressed={props.pressedFloors.includes(floorNumber)}
                    floorNumber={floorNumber}
                    key={floorNumber}
                />
            })
        }</div>
    </div>
}

function ElevatorPanel(props:Pick<ElevatorState, 'currentFloor' | 'passengerQueue' | 'floorState'>){
    const pressedFloors = Array.from(new Set(props.passengerQueue.reduce((prev, curr) => {
        const newFloor = curr.destinationFloor
        
        if(!(newFloor === props.currentFloor && props.floorState !== FloorState.OPEN)){
            return [...prev, newFloor]
        }
        return prev
    }, [] as number[])))

    return <CardWrapper col={12}>
        <div className="card-body">
            {
                Array.from(Array(4).keys()).reverse().map(val => {
                    return <ElevatorPanelRow
                        pressedFloors={pressedFloors}
                        startFloor={(val*5) + 1}
                        key={val + 1}
                    />
                })
            }
        </div>
    </CardWrapper>
    }

export default function ElevatorControl(props:Pick<ElevatorState, 'currentFloor' | 'direction' | 'floorState' | 'passengerQueue'>){
    return <div className="col col-lg-4">
        <div className="row row-cards">
            <div className="col col-lg-12">
                <ElevatorDisplay {...props} />
            </div>
            <ElevatorPanel {...props} />
        </div>
    </div>
}
import { DateTime } from "luxon"
import { Direction, FloorState, Tenant } from "./elevatorTypes"
import PassengerList from "./passengerList"
import PendingRequestsList from "./pendingRequestsList"
import ElevatorControl from "./elevatorControl"

function PageWrapper(props:{
    children:React.ReactNode
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
    const DUMMY_PASSENGERS:Tenant[] = [
        {
            name: "Something Something",
            destinationFloor: 5,
            direction: Direction.DOWN,
            startingFloor: 10,
            requestTime: DateTime.now().toJSDate()
        },
        {
            name: "Another Person",
            destinationFloor: 6,
            direction: Direction.UP,
            startingFloor: 5,
            requestTime: DateTime.now().toJSDate()
        },
        {
            name: "Third Person",
            destinationFloor: 4,
            direction: Direction.UP,
            startingFloor: 1,
            requestTime: DateTime.now().toJSDate()
        }
    ]

    const DUMMY_REQUESTS:Pick<Tenant, 'direction' | 'requestTime' | 'startingFloor'>[] = [
        {
            direction: Direction.UP,
            startingFloor: 10,
            requestTime: DateTime.now().toJSDate()
        },
        {
            direction: Direction.UP,
            startingFloor: 8,
            requestTime: DateTime.now().minus({seconds: 10}).toJSDate()
        },
        {
            direction: Direction.DOWN,
            startingFloor: 2,
            requestTime: DateTime.now().minus({seconds: 20}).toJSDate()
        },
        {
            direction: Direction.UP,
            startingFloor: 18,
            requestTime: DateTime.now().minus({seconds: 30}).toJSDate()
        },
        {
            direction: Direction.DOWN,
            startingFloor: 5,
            requestTime: DateTime.now().minus({seconds: 40}).toJSDate()
        }
    ]

    return <main>
        <PageWrapper>
            <PassengerList 
                elevatorPassengers={DUMMY_PASSENGERS}
            />
            <ElevatorControl
                currentFloor={8}
                direction={Direction.DOWN}
                floorState={FloorState.CLOSED}
                passengerQueue={DUMMY_PASSENGERS}
            />
            <PendingRequestsList
                pendingTenants={DUMMY_REQUESTS}
            />
        </PageWrapper>
    </main>
}
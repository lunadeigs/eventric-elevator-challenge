'use client'
import { Direction, Tenant } from "./elevatorTypes"
import CardWrapper from "./cardWrapper"
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react"

function PendingRequestRow(props:Pick<Tenant, 'direction' | 'requestTime' | 'startingFloor'>){
    return <tr className="w-100">
        <td className="w-5">Floor { props.startingFloor }</td>
        <td className="w-3">{
            props.direction === Direction.UP ?
                <IconArrowUp className="text-green"/> : <IconArrowDown className="text-red" />
        }</td>
        <td className="w-4">{props.requestTime}</td>
    </tr>
}

export default function PendingRequestsList(props:{
    pendingTenants: Pick<Tenant, 'direction' | 'requestTime' | 'startingFloor'>[]
    spawnTimer: number
}){
    return <CardWrapper col={4}>
        <div className="card-header">
            <h3 className="card-title">Pending Requests</h3>
        </div>

        <div 
            className="card-table table-responsive" 
            style={{
                    overflowY: "auto",
                    display: "block",
                    height: "50vh",
                    width: "inherit",
                    margin: 0,
                    padding: 0
            }}
        >
            <table className="table table-vcenter">
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Direction</th>
                        <th>Time Requested</th>
                    </tr>
                </thead>
                <tbody className="w-100" >{
                    props.pendingTenants.map((val) => {
                        return <PendingRequestRow
                            key={val.requestTime.toString()}
                            {...val}
                        />
                    })
                }</tbody>
            </table>
        </div>
        
        <div className="card-footer">
            <b>Next Request:</b> { 10 - props.spawnTimer } Seconds
        </div>
    </CardWrapper>
}
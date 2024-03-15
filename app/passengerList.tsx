'use client'

import CardWrapper from "./cardWrapper"
import { Tenant } from "./elevatorTypes"

function PassengerRow(props:Pick<Tenant, 'name' | 'destinationFloor'>){
    return <tr>
        <td className="w-10 text-capitalize">{props.name}</td>
        <td className="w-2">{props.destinationFloor}</td>
    </tr>
}

export default function PassengerList(props:{
    elevatorPassengers:Pick<Tenant, 'name' | 'destinationFloor'>[]
}){
    return <CardWrapper col={4}>
        <div className="card-header">
            <h3 className="card-title">Passenger List</h3>
        </div>
        <div className="card-table table-responsive" style={{
                    overflowY: "auto",
                    display: "block",
                    height: "50vh",
                    width: "inherit",
                    margin: 0,
                    padding: 0
            }}>
            <table className="table table-vcenter">
                <thead>
                    <tr>
                        <th className="w-10">Name</th>
                        <th className="w-2">Floor</th>
                    </tr>
                </thead>
                <tbody>{
                    props.elevatorPassengers.map((val, idx) => {
                        return <PassengerRow
                            key={idx}
                            {...val}
                        />
                    })
                }</tbody>
            </table>
        </div>
    </CardWrapper>
}
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
        <div className="card-table table-responsive">
            <table className="table table-vcenter">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Floor</th>
                    </tr>
                </thead>
                <tbody>{
                    props.elevatorPassengers.map((val) => {
                        return <PassengerRow
                            key={val.name}
                            {...val}
                        />
                    })
                }</tbody>
            </table>
        </div>
    </CardWrapper>
}
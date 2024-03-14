'use client'

import CardWrapper from "./cardWrapper"

function PassengerRow(props:{
    name:string,
    floor:number
}){
    return <tr>
        <td className="w-10 text-capitalize">{props.name}</td>
        <td className="w-2">{props.floor}</td>
    </tr>
}

export default function PassengerList(props:{
    elevatorPassengers: {
        name: string,
        floor: number
    }[]
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
                    props.elevatorPassengers.map((val, inx) => {
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
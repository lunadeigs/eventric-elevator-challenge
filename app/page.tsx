import PassengerList from "./passengerList"

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
    const DUMMY_PASSENGERS:{
        name:string,
        floor:number
    }[] = [
        {
            name: "Something Something",
            floor: 5
        },
        {
            name: "Another Person",
            floor: 6
        },
        {
            name: "Third Person",
            floor: 4
        }
    ]

    return <main>
        <PageWrapper>
            <PassengerList 
                elevatorPassengers={DUMMY_PASSENGERS}
            />
        </PageWrapper>
    </main>
}
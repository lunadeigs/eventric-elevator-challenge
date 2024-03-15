export default function CardWrapper(props:{
    col: number
    children: React.ReactNode
}){
    return <div className={`col col-lg-${props.col}`}>
        <div className="card">
            { props.children }
        </div>
    </div>
}
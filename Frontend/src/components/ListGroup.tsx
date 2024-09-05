function ListGroup() {
    const item = [
        'Berlin',
        'Hamburg',
        'Köln'
    ];

    return (
        <>
            <h1>Liste</h1>
            <ul className="list-group-item active">
                {item.map(item => <li key ={item}>{item}</li>)}
            </ul>
        </>);
}

export default ListGroup;
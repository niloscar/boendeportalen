import ListItem from "./ListItem.tsx";

const List = ({ items }) => {
    
    return (
        <div>
            <ul>
                {items.map((item) => (
                    <ListItem key={item.id} details={item} />
                ))
                }
            </ul>
        </div>
    )
}

export default List

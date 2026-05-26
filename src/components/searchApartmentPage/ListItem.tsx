import type { ListProp } from '../../types/apartment.ts';

const ListItem = ({ detail }: ListProp) => {
    return (
        <li className="flex justify-between gap-4">
            <p className="font-semibold">{detail.title}</p>
            <p className="self-end">{detail.content}</p>
        </li>
    )
}

export default ListItem

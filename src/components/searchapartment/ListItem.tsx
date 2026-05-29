import type { ListProp } from '../../types/apartment.ts';

const ListItem = ({ detail }: ListProp) => {
    return (
        <li className="flex justify-between md:max-w-sm">
            <p className="font-semibold w-s">{detail.title}</p>
            <p className="self-end w-s">{detail.content}</p>
        </li>
    )
}

export default ListItem

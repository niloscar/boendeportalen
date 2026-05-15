import type { FullData } from "../types/Apartment.ts";
type Props = {
    apartment: FullData
}
const ApartmentCard = ({ apartment }: Props) => {
    function subtractMonths(date:Date, months:number) {
        date.setMonth(date.getMonth() - months);
        return date;
    }
    const lastDay = subtractMonths(new Date(apartment.available), 1);
    const month = String(lastDay.getMonth()).padStart(2,"0");
    const day = String(lastDay.getDate()).padStart(2,"0");
    return (
        <section className="border-solid rounded-2xl bg-white">
            <img></img>
            <h2>{apartment.street}</h2>
            <section className="flex flex-row gap-4 items-center">
                <ul>
                    <li>Hyra:</li>
                    <li>Antal rum:</li>
                    <li>Inflyttning:</li>
                    <li>Sista anmälningsdag:</li>
                    <li>Område:</li>
                </ul>
                <ul>
                    <li>{apartment.rent}</li>
                    <li>{apartment.rooms}</li>
                    <li>{apartment.available}</li>
                    <li>{lastDay.getFullYear()}-{month}-{day}</li>
                    <li>{apartment.district}</li>
                </ul>
            </section>
        </section>
    )
}

export default ApartmentCard

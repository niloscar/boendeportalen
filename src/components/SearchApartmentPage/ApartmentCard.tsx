import type { ApartmentData } from "../../types/Apartment.ts";
type Props = {
    apartment: ApartmentData
}
const ApartmentCard = ({ apartment }: Props) => {
    function subtractMonths(date:Date, months:number) {
        date.setMonth(date.getMonth() - months);
        return date;
    }
    const lastDay = subtractMonths(new Date(apartment.available), 1);
    const month = String(Math.round(lastDay.getMonth()) + 1).padStart(2,"0");
    const day = String(lastDay.getDate()).padStart(2,"0");
    const mainImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/2019.07.10_metro_California-housing_Blog-post_related.webp/1920px-2019.07.10_metro_California-housing_Blog-post_related.webp.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail";
    return (
        <section className="border-solid rounded-2xl bg-white p-4 flex flex-col items-center basis-full gap-4 max-w-xs">
            <img src={mainImg} />
            <h2 className="text-2xl">{apartment.street}</h2>
            <section className="flex flex-row gap-4 justify-between w-full">
                <ul className="font-semibold">
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
            <button className="bg-neutral-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-neutral-800 transition duration-200 p-2 self-start">Läs mer</button>
        </section>
    )
}

export default ApartmentCard

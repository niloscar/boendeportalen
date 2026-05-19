import type { ApartmentData } from "../../types/Apartment.ts";
type Props = {
    apartment: ApartmentData
}
const ApartmentCard = ({ apartment }: Props) => {
    function subtractMonths(date:Date, months:number) {
        date.setMonth(date.getMonth() - months);
        return date;
    }

    const lastDay = subtractMonths(new Date(apartment.end_date), 1);
    const month = String(Math.round(lastDay.getMonth()) + 1).padStart(2,"0");
    const day = String(lastDay.getDate()).padStart(2,"0");
    const mainImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/2019.07.10_metro_California-housing_Blog-post_related.webp/1920px-2019.07.10_metro_California-housing_Blog-post_related.webp.png?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail";
    return (
        <section className="border-solid rounded-2xl bg-white p-4 flex flex-col items-center basis-full gap-4 max-w-xs">
            <img src={mainImg} />
            <h2 className="text-2xl">{apartment.street}</h2>
            <section>
                <ul className="w-full">
                    <li className="flex w-full justify-between"><p className="font-semibold">Hyra:</p><p className="self-end">{apartment.rent}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Antal rum:</p><p className="self-end">{apartment.rooms}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Inflyttning:</p><p className="self-end">{apartment.end_date}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Sista anmälningsdag:</p><p className="self-end">{lastDay.getFullYear()}-{month}-{day}</p></li>
                    <li className="flex w-full justify-between"><p className="font-semibold">Område:</p><p className="self-end">{apartment.district}</p></li>
                </ul>
            </section>
            <button className="bg-neutral-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-neutral-800 transition duration-200 p-2 self-start">Läs mer</button>
        </section>
    )
}

export default ApartmentCard

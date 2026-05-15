import type { Apartment } from "../types/Apartment.ts";
type Props = {
    apartment: Apartment
}
const ApartmentCard = ({ apartment } : Props) => {
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
            <li>Hyra:</li>
            <li>{apartment.rooms}</li>
            <li>Inflyttning:</li>
            <li>Sista anmälningsdag:</li>
            <li>{apartment.district}</li>
        </ul>
        </section>
    </section>
  )
}

export default ApartmentCard

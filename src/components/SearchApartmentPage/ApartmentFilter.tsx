import type { Filter } from "../../types/Apartment"
import Button from '../ui/Button';
import Style from '../../pages/SearchApartment.module.css'
const ApartmentFilter = ({ rooms, maxRent, district, filtersVisibility, selectedRooms, changeRent, selectedDistrict, filterResults, setVisibility }: Filter) => {
  const classes = filtersVisibility ? "border border-solid border-green-500 rounded-2xl bg-white p-6 z-50" : '';
  return (
    <div className="self-end relative h-10">
      <div className={`flex flex-col absolute right-0 top-0 min-w-min ${classes}`}>
        <Button variant="primary" size="md" type="button" children="Tillgängliga Filter" onClick={() => setVisibility(!filtersVisibility)} />
        <form className={`${!filtersVisibility ? Style.hidden : Style.visible}`}>
          <div className="pt-2 pb-2">
            <h3 className="font-semibold">Antal rum</h3>
            <div className="flex justify-between w-full">
              <div>
                <input type="checkbox" id="1Room" name="1" value="1 rum" checked={rooms.find(r => r == "1") ? true : false} onChange={(e) => selectedRooms(e)} />
                <label htmlFor="1Room">1 rum</label>
              </div>
              <div>
                <input type="checkbox" id="2Room" name="2" value="2 rum" checked={rooms.find(r => r == "2") ? true : false} onChange={(e) => selectedRooms(e)} />
                <label htmlFor="2Room">2 rum</label>
              </div>
              <div>
                <input type="checkbox" id="3Room" name="3" value="3 rum" checked={rooms.find(r => r == "3") ? true : false} onChange={(e) => selectedRooms(e)} />
                <label htmlFor="3Room">3 rum</label>
              </div>
            </div>
          </div>
          <div className="pt-2 pb-2">
            <label htmlFor="rent" className="font-semibold">Maxhyra</label>
            <div className="flex gap-2">
              <input type="range" min="1000" max="20000" value={maxRent} id="rentRange" onChange={(e) => changeRent(e)} />
              <p>{maxRent}</p>
            </div>
          </div>
          <div className="pt-2 pb-2">
            <h3 className="font-semibold">Område</h3>
            <input type="checkbox" id="area1" name="Östermalm" value="Östermalm" checked={district.find(a => a == "Östermalm") ? true : false} onChange={(e) => selectedDistrict(e)} />
            <label htmlFor="area1">Östermalm</label>
          </div>
          <Button variant="primary" size="md" type="button" children="Filtrera" onClick={(e) => filterResults(e)} />
        </form>
      </div>
    </div>
  )
}

export default ApartmentFilter

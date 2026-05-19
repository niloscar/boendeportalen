import type { Filter } from "../../types/Apartment"
const ApartmentFilter = ({ rooms, maxRent, district, selectedRooms, changeRent, selectedDistrict, filterResults }: Filter) => {

  return (
    <div>
      <button className="bg-neutral-900 text-white font-semibold rounded-2xl cursor-pointer hover:bg-neutral-800 transition duration-200 p-2 self-end">Filter</button>
      <form>
        <div>
          <p>Antal rum</p>
          <input type="checkbox" id="1Room" name="1" value="1 rum" checked={rooms.find(r => r == "1") ? true : false} onChange={(e) => selectedRooms(e)} />
          <label htmlFor="1Room">1 rum</label><br />
          <input type="checkbox" id="2Room" name="2" value="2 rum" checked={rooms.find(r => r == "2") ? true : false} onChange={(e) => selectedRooms(e)} />
          <label htmlFor="2Room">2 rum</label><br />
          <input type="checkbox" id="3Room" name="3" value="3 rum" checked={rooms.find(r => r == "3") ? true : false} onChange={(e) => selectedRooms(e)} />
          <label htmlFor="3Room">3 rum</label>
        </div>
        <div>
          <label htmlFor="rent">Maxhyra</label>
          <input type="range" min="1000" max="20000" value={maxRent} id="rentRange" onChange={(e) => changeRent(e)} />
          <p>{maxRent}</p>
        </div>
        <div>
          <p>Område</p>
          <input type="checkbox" id="area1" name="Östermalm" value="Östermalm" checked={district.find(a => a == "Östermalm") ? true : false} onChange={(e) => selectedDistrict(e)} />
          <label htmlFor="area1">Östermalm</label>
        </div>
        <button onClick={(e) => filterResults(e)}>Filtrera</button>
      </form>
    </div>
  )
}

export default ApartmentFilter

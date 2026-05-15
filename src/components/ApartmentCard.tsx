import React from 'react'
import type { Apartment } from "../types/Apartment.ts";
type Props = {
    apartment: Apartment
}
const ApartmentCard = ({ apartment } : Props) => {
  return (
    <div>
      {apartment.id}
    </div>
  )
}

export default ApartmentCard

const GuestSuiteInfo = () => {
  return (
    <div>
          Välkommen att boka vår gästlägenhet! Gästlägenheten är tillgänglig för dig som hyresgäst när du får besök av familj eller vänner och behöver extra utrymme. Nedan hittar du all viktig information inför din bokning.

          <h3 className="text-xl mb-2 mt-6">💰 Pris och betalning</h3><ul className="list-disc list-inside text-gray-700 p-0"><li>Kostnaden är 200 kr per natt.</li><li>Avgiften läggs automatiskt på din nästa hyresavi.</li></ul>
          <h3 className="text-xl mb-2 mt-6">📅 Bokningsregler</h3><p>För att alla hyresgäster ska ha möjlighet att nyttja gästlägenheten gäller följande:</p><ul className="list-disc list-inside text-gray-700 m-2 p-0"><li>Du kan ha max 5 aktiva bokningar åt gången.</li><li>Det går att boka upp till ett år framåt i tiden.</li><li>Bokningen är personlig och får inte överlåtas.</li></ul>
          <h3 className="text-xl mb-2 mt-6">🧹 Städning och ansvar</h3><p>För att hålla gästlägenheten trivsam för alla är det viktigt att du:</p><ul className="list-disc list-inside text-gray-700 m-2 p-0"><li>Städar efter dig enligt städinstruktionerna.</li><li>Lämnar lägenheten i gott skick.</li></ul><p>Om reglerna inte följs kan straffavgift tillkomma för extra städning eller skador.</p>
    </div>
  )
}

export default GuestSuiteInfo

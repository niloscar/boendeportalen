import { BroomIcon, CalendarDotsIcon, MoneyIcon } from "@phosphor-icons/react";

const GuestSuiteInfo = () => {
	return (
		<div className="text-gray-600 pt-2">
			Välkommen att boka vår gästlägenhet! Gästlägenheten är tillgänglig för dig som hyresgäst när du får besök av familj eller vänner och behöver extra utrymme. Nedan hittar du all viktig information inför din bokning.

			<div className="flex items-center gap-2 pt-6 pb-2">
				<MoneyIcon size={26} className="text-neutral-900" />
				<h3 className="text-neutral-900 text-lg font-semibold">Pris och betalning</h3>
			</div>
			<ul className="list-disc list-inside text-gray-600"><li>Kostnaden är 200 kr per natt.</li><li>Avgiften läggs automatiskt på din nästa hyresavi.</li></ul>
			<div className="flex items-center gap-2 pt-6 pb-2">
				<CalendarDotsIcon size={26} className="text-neutral-900" />
				<h3 className="text-neutral-900 text-lg font-semibold">Bokningsregler</h3>
			</div>
			<p>För att alla hyresgäster ska ha möjlighet att nyttja gästlägenheten gäller följande:</p><ul className="list-disc list-inside text-gray-600 pt-2"><li>Du kan ha max 5 aktiva bokningar åt gången.</li><li>Det går att boka upp till ett år framåt i tiden.</li><li>Bokningen är personlig och får inte överlåtas.</li></ul>
			<div className="flex items-center gap-2 pt-6 pb-2">
				<BroomIcon size={26} className="text-neutral-900" />
				<h3 className="text-neutral-900 text-lg font-semibold">Städning och ansvar</h3>
			</div>
			<p>För att hålla gästlägenheten trivsam för alla är det viktigt att du:</p><ul className="list-disc list-inside text-gray-600 py-2"><li>Städar efter dig enligt städinstruktionerna.</li><li>Lämnar lägenheten i gott skick.</li></ul><p>Om reglerna inte följs kan straffavgift tillkomma för extra städning eller skador.</p>
		</div>
	)
}

export default GuestSuiteInfo

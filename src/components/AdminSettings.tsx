import styles from './AdminSettings.module.css'

export default function AdminSettings() {
    return (
        <form className={`flex flex-col gap-4 ${styles['admin-settings-form']}`}>
            <fieldset>
            <h2 className="text-lg font-semibold mb-4">Aktiva funktioner</h2>
            <table className="table-auto w-auto">
                <tbody>
                    <tr>
                        <td>Funktion 1</td>
                        <td>
                            <input type="radio" className="form-radio mr-2 text-green-500 cursor-pointer" name="function1" id="function1-active" />
                            <label htmlFor="function1-active" className="cursor-pointer">
                                Aktiv
                            </label>
                        </td>
                        <td>
                            <input type="radio" className="form-radio mr-2 text-green-500 cursor-pointer" name="function1" id="function1-inactive" />
                            <label htmlFor="function1-inactive" className="cursor-pointer">
                                Inaktiv
                            </label>
                        </td>
                    </tr>
                </tbody>
            </table>
            </fieldset>
            <fieldset>
            <h2 className="text-lg font-semibold mb-4">Widgets i kontrollpanelen</h2>
            <canvas className="w-full h-64 bg-neutral-200 rounded-lg">
                <div>Test</div>
                <div>Test</div>
            </canvas>
            </fieldset>
            <button type="submit" className="bg-neutral-700 text-white px-4 py-2 rounded-md hover:bg-neutral-600 cursor-pointer">Spara inställningar</button>
        </form>
    )
}
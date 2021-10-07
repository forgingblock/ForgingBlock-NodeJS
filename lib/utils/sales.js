
function cleanData(arrayOfObjects) {
    for (const index in arrayOfObjects) {
        for (const key in arrayOfObjects[index]) {
            if (!arrayOfObjects[index][key] && arrayOfObjects[index][key] !== 0) {
                delete arrayOfObjects[index][key]
            } else if (key.includes('Date')) {
                arrayOfObjects[index][key] = new Date(
                    arrayOfObjects[index][key]
                ).toLocaleDateString()
            }
        }
    }

    return arrayOfObjects
}

function filterPaidInvoices(invoices) {
    return invoices.filter(
        el =>
            el.InvoiceStatus === 'paid' ||
            el.InvoiceStatus === 'confirmed' ||
            el.InvoiceStatus === 'complete'
    )
}

module.exports = {
    cleanData,
    filterPaidInvoices
}
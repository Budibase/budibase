// https://www.ag-grid.com/javascript-grid-value-setters/
// These handles values and makes sure they adhere to the data type provided by the model
export const number = (params) => {
    console.log('Params: ', params)
    console.log('New Value: ', parseFloat(params.newValue))
    params.data[params.colDef.field] = parseFloat(params.newValue);
    return true;
}
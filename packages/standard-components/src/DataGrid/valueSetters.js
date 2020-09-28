// https://www.ag-grid.com/javascript-grid-value-setters/
// These handles values and makes sure they adhere to the data type provided by the model
export const number = (params) => {
    params.data[params.colDef.field] = parseFloat(params.newValue);
    return true;
}
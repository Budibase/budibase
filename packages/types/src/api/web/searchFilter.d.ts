import { FieldType } from "../../documents";
import { EmptyFilterOption, UILogicalOperator, BasicOperator, RangeOperator, ArrayOperator } from "../../sdk";
type AllOr = {
    operator: "allOr";
};
type OnEmptyFilter = {
    onEmptyFilter: EmptyFilterOption;
};
export type SearchFilter = {
    operator: BasicOperator | RangeOperator | ArrayOperator | "rangeLow" | "rangeHigh";
    field: string;
    value: any;
    type?: FieldType;
    externalType?: string;
    noValue?: boolean;
    valueType?: string;
    formulaType?: string;
};
export type LegacyFilter = AllOr | OnEmptyFilter | SearchFilter;
export type SearchFilterGroup = {
    logicalOperator?: UILogicalOperator;
    groups?: SearchFilterGroup[];
    filters?: LegacyFilter[];
};
export type UISearchFilter = {
    logicalOperator?: UILogicalOperator;
    onEmptyFilter?: EmptyFilterOption;
    groups?: SearchFilterGroup[];
};
export {};

import * as Types from '../typebox';
export declare enum ValueErrorType {
    Array = 0,
    ArrayMinItems = 1,
    ArrayMaxItems = 2,
    ArrayUniqueItems = 3,
    Boolean = 4,
    Function = 5,
    Integer = 6,
    IntegerMultipleOf = 7,
    IntegerExclusiveMinimum = 8,
    IntegerExclusiveMaximum = 9,
    IntegerMinimum = 10,
    IntegerMaximum = 11,
    Literal = 12,
    Never = 13,
    Null = 14,
    Number = 15,
    NumberMultipleOf = 16,
    NumberExclusiveMinimum = 17,
    NumberExclusiveMaximum = 18,
    NumberMinumum = 19,
    NumberMaximum = 20,
    Object = 21,
    ObjectMinProperties = 22,
    ObjectMaxProperties = 23,
    ObjectAdditionalProperties = 24,
    ObjectRequiredProperties = 25,
    Promise = 26,
    RecordKeyNumeric = 27,
    RecordKeyString = 28,
    String = 29,
    StringMinLength = 30,
    StringMaxLength = 31,
    StringPattern = 32,
    StringFormatUnknown = 33,
    StringFormat = 34,
    TupleZeroLength = 35,
    TupleLength = 36,
    Undefined = 37,
    Union = 38,
    Uint8Array = 39,
    Uint8ArrayMinByteLength = 40,
    Uint8ArrayMaxByteLength = 41,
    Void = 42
}
export interface ValueError {
    type: ValueErrorType;
    schema: Types.TSchema;
    path: string;
    value: unknown;
    message: string;
}
export declare class ValueErrorsUnknownTypeError extends Error {
    readonly schema: Types.TSchema;
    constructor(schema: Types.TSchema);
}
export declare namespace ValueErrors {
    function Errors<T extends Types.TSchema>(schema: T, references: Types.TSchema[], value: any): IterableIterator<ValueError>;
}

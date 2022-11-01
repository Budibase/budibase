import {expectAssignable, expectError, expectNotAssignable, expectType} from 'tsd';
import {
    CronDate,
    CronExpression,
    CronFields, DateType,
    parseExpression,
    parseFile, ParserOptions,
    parseString,
    fieldsToExpression,
    StringResult
} from '../types/ts3';

const interval = parseExpression('0 1 2 3 * 1-3,5');
const intervalIterator = parseExpression('0 1 2 3 * 1-3,5', {iterator: true});

expectType<readonly number[]>(interval.fields.second);
expectType<readonly number[]>(interval.fields.minute);
expectType<readonly number[]>(interval.fields.hour);
expectType<readonly (number | 'L')[]>(interval.fields.dayOfMonth);
expectType<readonly number[]>(interval.fields.month);
expectType<readonly number[]>(interval.fields.dayOfWeek);

expectError(interval.fields = interval.fields);

expectError(interval.fields.second = []);
expectError(interval.fields.second.push(1));

expectError(interval.fields.minute = []);
expectError(interval.fields.minute.push(1));

expectError(interval.fields.hour = []);
expectError(interval.fields.hour.push(1));

expectError(interval.fields.dayOfMonth = []);
expectError(interval.fields.dayOfMonth.push(1));

expectError(interval.fields.month = []);
expectError(interval.fields.month.push(1));

expectError(interval.fields.dayOfWeek = []);
expectError(interval.fields.dayOfWeek.push(1));

expectAssignable<typeof interval.fields.second[0]>(0);
expectAssignable<typeof interval.fields.second[0]>(59);

expectAssignable<typeof interval.fields.minute[0]>(0);
expectAssignable<typeof interval.fields.minute[0]>(59);

expectAssignable<typeof interval.fields.hour[0]>(0);
expectAssignable<typeof interval.fields.hour[0]>(23);

expectAssignable<typeof interval.fields.dayOfMonth[0]>(1);
expectAssignable<typeof interval.fields.dayOfMonth[0]>(31);
expectAssignable<typeof interval.fields.dayOfMonth[0]>('L');

expectAssignable<typeof interval.fields.month[0]>(1);
expectAssignable<typeof interval.fields.month[0]>(12);

expectAssignable<typeof interval.fields.dayOfWeek[0]>(0);
expectAssignable<typeof interval.fields.dayOfWeek[0]>(7);

const parseOptions: ParserOptions<true> = {
    currentDate: 'f',
    startDate: 4,
    endDate: new Date(),
    iterator: true,
    utc: true,
    tz: 'f',
    nthDayOfWeek: 5,
}
expectAssignable<{
    currentDate?: string | number | Date
    startDate?: string | number | Date
    endDate?: string | number | Date
    iterator?: boolean
    utc?: boolean
    tz?: string
    nthDayOfWeek?: number
}>(parseOptions)

expectType<CronExpression>(parseExpression('0 1 2 3 * 1-3,5'))
expectType<CronExpression<true>>(parseExpression('0 1 2 3 * 1-3,5', parseOptions))

const fields: CronFields = {
    second: [1, 1],
    minute: [1],
    hour: [1],
    dayOfMonth: [1],
    month: [1],
    dayOfWeek: [1],
}

expectType<CronExpression>(fieldsToExpression(fields))
expectType<CronExpression<true>>(fieldsToExpression(fields, parseOptions))

expectType<string>(fieldsToExpression(fields).stringify())
expectType<string>(fieldsToExpression(fields, parseOptions).stringify())
expectType<string>(fieldsToExpression(fields, parseOptions).stringify(true))

expectType<void>(parseFile('path', (err: any, data: StringResult) => console.log(data)))

expectType<StringResult>(parseString('path'))

const stringResult = parseString('path');
expectType<{
    variables: Record<string, string>,
    expressions: CronExpression[],
    errors: Record<string, any>,
}>(stringResult)

expectType<CronFields>(interval.fields)
expectType<CronDate>(interval.next())
expectType<CronDate>(interval.prev())
expectType<boolean>(interval.hasNext())
expectType<boolean>(interval.hasPrev())
expectType<string>(interval.stringify())
expectType<string>(interval.stringify(true))
expectType<void>(interval.reset())
expectType<void>(interval.reset("Sdf"))
expectType<void>(interval.reset(5))
expectType<void>(interval.reset(new Date()))
expectType<CronDate[]>(interval.iterate(5))
expectType<CronDate[]>(interval.iterate(5, (item: CronDate, i: number) => {}))

expectAssignable<DateType>(new Date())
expectAssignable<DateType>(5)
expectAssignable<DateType>("SDf")


expectType<IteratorResult<CronDate, CronDate>>(intervalIterator.next())
expectType<IteratorResult<CronDate, CronDate>>(intervalIterator.prev())
expectType<IteratorResult<CronDate, CronDate>[]>(intervalIterator.iterate(5))
expectType<IteratorResult<CronDate, CronDate>[]>(intervalIterator.iterate(5, (item: IteratorResult<CronDate, CronDate>, i: number) => {}))

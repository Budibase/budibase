import { default as ClickHouseIntegration } from '../clickhouse';
import { ClickHouse } from 'clickhouse';

const toPromiseMock = jest.fn();

// Mock the module
jest.mock('clickhouse', () => {
  return {
    ClickHouse: jest.fn().mockImplementation(() => ({
      query: jest.fn().mockReturnThis(), // ensure that .query().toPromise() chaining works
      toPromise: toPromiseMock, 
    })),
  };
});

describe('ClickHouse Integration', () => {
  let clickHouseIntegration;

  beforeEach(() => {
    clickHouseIntegration = new ClickHouseIntegration.integration({
      url: 'http://localhost:8123',
      username: 'default',
      password: '',
      databaseName: 'default',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('read method should return the result of the query', async () => {
    const resultVal = [{ id: 1, name: 'John' }];  
    const mockQuery = { sql: 'SELECT * FROM table' };
    toPromiseMock.mockResolvedValue(resultVal);
    const result = await clickHouseIntegration.read(mockQuery);

    expect(ClickHouse).toHaveBeenCalledTimes(1);
    expect(ClickHouse).toHaveBeenCalledWith({
      url: 'http://localhost:8123',
      config: {
        database: 'default',
      },
      basicAuth: {
        username: 'default',
        password: '',
      },
    });
    expect(result).toEqual(resultVal);
  });

  test('read method should throw an error if the query fails', async () => {
    const mockQuery = { sql: 'SELECT * FROM table' };
    const mockError = new Error('Query failed');

    toPromiseMock.mockRejectedValue(mockError);

    await expect(clickHouseIntegration.read(mockQuery)).rejects.toThrowError(
      'Query failed'
    );

    expect(ClickHouse).toHaveBeenCalledTimes(1);
    expect(ClickHouse).toHaveBeenCalledWith({
      url: 'http://localhost:8123',
      config: {
        database: 'default',
      },
      basicAuth: {
        username: 'default',
        password: '',
      },
    });
  });
});
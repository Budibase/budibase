import { CreateRowParams, Row } from "../../types"
import { generator } from "../../shared"

export const generateRow = (overrides: Partial<Row> = {}): CreateRowParams => ({
  type: "row",
  tableId: "seed_table",
  testColumn: generator.string({ length: 32, alpha: true, numeric: true }),
  relationship: [generator.string({ length: 32, alpha: true, numeric: true })],
  ...overrides,
})

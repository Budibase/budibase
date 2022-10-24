import {
  ScheduleMetadata,
  ScheduleRepeatPeriod,
  ScheduleType,
} from "../../documents"

export interface CreateScheduleRequest {
  type: ScheduleType
  name: string
  startDate: string
  repeat: ScheduleRepeatPeriod
  metadata: ScheduleMetadata
}

export interface UpdateScheduleRequest extends CreateScheduleRequest {}

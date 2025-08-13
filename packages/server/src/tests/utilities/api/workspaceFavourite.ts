import {
  AddWorkspaceFavouriteResponse,
  DeleteWorkspaceFavouriteResponse,
  WithoutDocMetadata,
  WorkspaceFavourite,
  WorkspaceFavouriteResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"

export type CreateRequestRaw = Omit<
  WithoutDocMetadata<WorkspaceFavourite>,
  "createdBy"
>

export class WorkspaceFavouriteAPI extends TestAPI {
  save = async (
    body: CreateRequestRaw,
    expectations?: Expectations
  ): Promise<AddWorkspaceFavouriteResponse> => {
    const result = await this._post<AddWorkspaceFavouriteResponse>(
      `/api/workspace/favourites`,
      {
        body,
        expectations: { status: 201, ...(expectations || {}) },
      }
    )
    return result
  }
  fetchAll = async (
    expectations?: Expectations
  ): Promise<WorkspaceFavouriteResponse> => {
    return await this._get<WorkspaceFavouriteResponse>(
      `/api/workspace/favourites`,
      {
        expectations,
      }
    )
  }
  delete = async (
    favourite: WorkspaceFavourite,
    expectations?: Expectations
  ): Promise<DeleteWorkspaceFavouriteResponse> => {
    return await this._delete<DeleteWorkspaceFavouriteResponse>(
      `/api/workspace/favourites/${favourite._id!}/${favourite._rev!}`,
      {
        expectations,
      }
    )
  }
}

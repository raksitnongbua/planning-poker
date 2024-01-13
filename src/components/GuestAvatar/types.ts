export interface Props {
  name: string
  estimatedPoint: number
  isCardReveled: boolean
  isShowingCard: boolean
  activeStatus: ActiveStatus
}

export enum ActiveStatus {
  Active,
  Busy,
  Inactive,
}

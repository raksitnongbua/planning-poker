export interface Props {
  name: string
  estimatedPoint: string
  isCardReveled: boolean
  isShowingCard: boolean
  activeStatus: ActiveStatus
}

export enum ActiveStatus {
  Active,
  Busy,
  Inactive,
}

export interface Props {
  name: string
  estimatedValue: string
  isCardReveled: boolean
  isShowingCard: boolean
  activeStatus: ActiveStatus
  avatar?: string
}

export enum ActiveStatus {
  Active,
  Busy,
  Inactive,
}

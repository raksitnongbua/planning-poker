export interface Props {
  open: boolean
  onClickConfirm: (name: string, isAllowedUseProfile: boolean) => void
  hasAvatar: boolean
  defaultName?: string
  signedIn?: boolean
}

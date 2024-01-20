import { AxiosRequestConfig } from 'axios'
import SWR, { Key, SWRConfiguration, useSWRConfig } from 'swr'

import { httpClient } from '@/utils/httpClient'

const fetcher = ({ ...args }) => httpClient({ ...args }).then((res) => res.data)

export const useCustomSWR = (key: Key | AxiosRequestConfig, options?: SWRConfiguration) =>
  SWR(key, fetcher, { revalidateOnFocus: false, ...options })

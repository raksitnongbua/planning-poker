import { AxiosRequestConfig } from 'axios'
import useSWR, { Key, SWRConfiguration } from 'swr'

import { httpClient } from '@/utils/httpClient'

const fetcher = ({ ...args }) => httpClient({ ...args }).then((res) => res.data)

export const useCustomSWR = (key: Key | AxiosRequestConfig, options?: SWRConfiguration) =>
  useSWR(key, fetcher, { revalidateOnFocus: false, ...options })

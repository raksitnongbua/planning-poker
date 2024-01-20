import axios, { AxiosRequestHeaders } from 'axios'

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
})

const mutationFn =
  <TData = unknown>(url: string) =>
  (variables: TData): Promise<any> =>
    httpClient.post(url, variables).then((res) => res.data)

export { httpClient, mutationFn }

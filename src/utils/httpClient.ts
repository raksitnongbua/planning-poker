import axios, { AxiosRequestHeaders } from 'axios'

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
})

export { httpClient }

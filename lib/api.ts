import axios from 'axios'
import { DosageResult, PatientForm } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export async function calculateDosage(form: PatientForm): Promise<DosageResult> {
  const response = await api.post('/calculate/', {
    age: parseInt(form.age),
    sex: form.sex,
    weight: parseFloat(form.weight),
    height: parseFloat(form.height),
  })
  return response.data
}

export async function getCategories() {
  const response = await api.get('/categories/')
  return response.data
}

export async function getDrugs(categoryId?: number) {
  const url = categoryId ? `/drugs/?category=${categoryId}` : '/drugs/'
  const response = await api.get(url)
  return response.data
}

export async function getDrugDetail(id: number, age: number, weight: number) {
  const response = await api.get(`/drugs/${id}/?age=${age}&weight=${weight}`)
  return response.data
}

export async function healthCheck() {
  const response = await api.get('/health/')
  return response.data
}

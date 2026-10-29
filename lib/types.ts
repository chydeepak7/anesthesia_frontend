export interface CalculatedDose {
  dose_min_per_kg: number
  dose_max_per_kg: number
  calculated_min_mg: number
  calculated_max_mg: number
  dosing_weight_kg: number
  age_group: string
  dose_basis: 'actual' | 'ibw' | 'lbw' | 'adjusted'
  dose_basis_label: string
}

export interface Drug {
  id: number
  name: string
  generic_name: string
  drug_class: string
  category: number
  category_name: string
  category_icon: string
  route: string
  route_display: string
  dose_unit: string
  onset_time: string
  duration: string
  mechanism: string
  indications: string
  contraindications: string
  side_effects: string
  notes: string
  warnings: string
  calculated_dose: CalculatedDose
}

export interface DrugCategory {
  category_id: number
  category_name: string
  category_icon: string
  category_description: string
  drugs: Drug[]
}

export interface PatientInfo {
  age: number
  sex: string
  weight: number
  height: number
  ibw: number
  lbw: number
  bmi: number
  age_group: string
}

export interface DosageResult {
  patient: PatientInfo
  total_drugs: number
  categories: DrugCategory[]
}

export interface PatientForm {
  age: string
  sex: 'male' | 'female' | ''
  weight: string
  height: string
}

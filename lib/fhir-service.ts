import { createClient } from "@supabase/supabase-js"

// FHIR Resource Types
export type FHIRResourceType =
  | "Patient"
  | "Observation"
  | "Condition"
  | "DiagnosticReport"
  | "Specimen"
  | "MolecularSequence"

// Basic FHIR Resource interface
export interface FHIRResource {
  resourceType: FHIRResourceType
  id: string
  meta?: {
    versionId?: string
    lastUpdated?: string
    source?: string
    security?: Array<{
      system: string
      code: string
      display: string
    }>
  }
}

// Patient Resource
export interface FHIRPatient extends FHIRResource {
  resourceType: "Patient"
  name?: Array<{
    use?: string
    text?: string
    family?: string
    given?: string[]
  }>
  gender?: string
  birthDate?: string
  address?: Array<{
    use?: string
    text?: string
    line?: string[]
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }>
  identifier?: Array<{
    system?: string
    value?: string
  }>
}

// Observation Resource (for genomic data)
export interface FHIRObservation extends FHIRResource {
  resourceType: "Observation"
  status: string
  category?: Array<{
    coding: Array<{
      system: string
      code: string
      display: string
    }>
  }>
  code: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
    text?: string
  }
  subject: {
    reference: string
    display?: string
  }
  effectiveDateTime?: string
  valueString?: string
  valueCodeableConcept?: {
    coding: Array<{
      system: string
      code: string
      display: string
    }>
    text?: string
  }
  component?: Array<{
    code: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
      text?: string
    }
    valueString?: string
    valueCodeableConcept?: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
      text?: string
    }
  }>
}

// MolecularSequence Resource
export interface FHIRMolecularSequence extends FHIRResource {
  resourceType: "MolecularSequence"
  type?: string
  coordinateSystem?: number
  patient?: {
    reference: string
    display?: string
  }
  specimen?: {
    reference: string
    display?: string
  }
  referenceSeq?: {
    referenceSeqId?: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }
    windowStart?: number
    windowEnd?: number
    strand?: string
    referenceSeqString?: string
  }
  variant?: Array<{
    start?: number
    end?: number
    observedAllele?: string
    referenceAllele?: string
  }>
  quality?: Array<{
    type: string
    standardSequence?: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }
    start?: number
    end?: number
    score?: {
      value: number
    }
    method?: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }
  }>
  repository?: string
  pointer?: Array<{
    reference: string
  }>
  structureVariant?: Array<{
    variantType?: {
      coding: Array<{
        system: string
        code: string
        display: string
      }>
    }
    exact?: boolean
    length?: number
    outer?: {
      start?: number
      end?: number
    }
    inner?: {
      start?: number
      end?: number
    }
  }>
}

// FHIR API Service
export class FHIRService {
  private supabase
  private fhirBaseUrl: string
  private authToken?: string

  constructor() {
    // Initialize Supabase client for storing FHIR data locally
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    try {
      this.supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      this.supabase = null
    }

    // FHIR server URL (e.g., EPIC FHIR API endpoint)
    this.fhirBaseUrl =
      process.env.NEXT_PUBLIC_FHIR_BASE_URL || "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/"
  }

  // Set authentication token for FHIR API
  setAuthToken(token: string) {
    this.authToken = token
  }

  // Generic method to fetch FHIR resources
  async fetchResource<T extends FHIRResource>(
    resourceType: FHIRResourceType,
    id?: string,
    params?: Record<string, string>,
  ): Promise<T | null> {
    try {
      let url = `${this.fhirBaseUrl}${resourceType}`
      if (id) {
        url += `/${id}`
      }

      // Add query parameters
      if (params) {
        const queryParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          queryParams.append(key, value)
        })
        url += `?${queryParams.toString()}`
      }

      const headers: HeadersInit = {
        Accept: "application/fhir+json",
        "Content-Type": "application/fhir+json",
      }

      // Add authorization if token is available
      if (this.authToken) {
        headers["Authorization"] = `Bearer ${this.authToken}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers,
      })

      if (!response.ok) {
        throw new Error(`FHIR API error: ${response.status} ${response.statusText}`)
      }

      return (await response.json()) as T
    } catch (error) {
      console.error("Error fetching FHIR resource:", error)
      return null
    }
  }

  // Fetch patient by ID
  async getPatient(id: string): Promise<FHIRPatient | null> {
    return this.fetchResource<FHIRPatient>("Patient", id)
  }

  // Search patients by parameters
  async searchPatients(params: Record<string, string>): Promise<FHIRPatient[]> {
    try {
      const result = await this.fetchResource<{ entry?: Array<{ resource: FHIRPatient }> }>(
        "Patient",
        undefined,
        params,
      )
      return result?.entry?.map((entry) => entry.resource) || []
    } catch (error) {
      console.error("Error searching patients:", error)
      return []
    }
  }

  // Fetch genomic observations for a patient
  async getGenomicObservations(patientId: string): Promise<FHIRObservation[]> {
    try {
      // Search for genomic observations using LOINC codes for genomic findings
      const params = {
        patient: patientId,
        category: "laboratory",
        code: "51969-4,55233-1,82810-3", // LOINC codes for genetic findings
      }

      const result = await this.fetchResource<{ entry?: Array<{ resource: FHIRObservation }> }>(
        "Observation",
        undefined,
        params,
      )
      return result?.entry?.map((entry) => entry.resource) || []
    } catch (error) {
      console.error("Error fetching genomic observations:", error)
      return []
    }
  }

  // Fetch molecular sequences for a patient
  async getMolecularSequences(patientId: string): Promise<FHIRMolecularSequence[]> {
    try {
      const params = {
        patient: patientId,
      }

      const result = await this.fetchResource<{ entry?: Array<{ resource: FHIRMolecularSequence }> }>(
        "MolecularSequence",
        undefined,
        params,
      )
      return result?.entry?.map((entry) => entry.resource) || []
    } catch (error) {
      console.error("Error fetching molecular sequences:", error)
      return []
    }
  }

  // Store FHIR resource in Supabase for local caching
  async storeResource<T extends FHIRResource>(resource: T): Promise<void> {
    if (!this.supabase) {
      console.warn("Supabase client not initialized, cannot store resource")
      return
    }

    try {
      const { error } = await this.supabase.from("fhir_resources").upsert({
        resource_type: resource.resourceType,
        resource_id: resource.id,
        data: resource,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
    } catch (error) {
      console.error("Error storing FHIR resource:", error)
    }
  }

  // Retrieve cached FHIR resource from Supabase
  async getCachedResource<T extends FHIRResource>(resourceType: FHIRResourceType, id: string): Promise<T | null> {
    if (!this.supabase) {
      console.warn("Supabase client not initialized, cannot get cached resource")
      return null
    }

    try {
      const { data, error } = await this.supabase
        .from("fhir_resources")
        .select("data")
        .eq("resource_type", resourceType)
        .eq("resource_id", id)
        .single()

      if (error) throw error
      return (data?.data as T) || null
    } catch (error) {
      console.error("Error retrieving cached FHIR resource:", error)
      return null
    }
  }
}

// Export singleton instance
export const fhirService = new FHIRService()


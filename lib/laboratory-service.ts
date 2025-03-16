import { fhirService, type FHIRResource } from "./fhir-service"

// Laboratory Report Resource
export interface FHIRDiagnosticReport extends FHIRResource {
  resourceType: "DiagnosticReport"
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
  issued?: string
  performer?: Array<{
    reference: string
    display?: string
  }>
  result?: Array<{
    reference: string
    display?: string
  }>
  conclusion?: string
  presentedForm?: Array<{
    contentType: string
    data?: string
    url?: string
    title?: string
  }>
}

// Laboratory Result Resource
export interface FHIRObservationResult extends FHIRResource {
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
  valueQuantity?: {
    value: number
    unit: string
    system: string
    code: string
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
  interpretation?: Array<{
    coding: Array<{
      system: string
      code: string
      display: string
    }>
    text?: string
  }>
  referenceRange?: Array<{
    low?: {
      value: number
      unit: string
    }
    high?: {
      value: number
      unit: string
    }
    text?: string
  }>
}

// Structured laboratory report with results
export interface LaboratoryReport {
  id: string
  patientId: string
  reportDate: string
  category: string
  code: string
  name: string
  status: string
  performer?: string
  conclusion?: string
  results: LaboratoryResult[]
}

// Laboratory result structure
export interface LaboratoryResult {
  id: string
  code: string
  name: string
  value?: string | number
  unit?: string
  referenceRange?: string
  interpretation?: string
  abnormal: boolean
}

// Laboratory Service class
export class LaboratoryService {
  // Fetch laboratory reports for a patient
  async getPatientLaboratoryReports(patientId: string): Promise<LaboratoryReport[]> {
    try {
      // Search for laboratory diagnostic reports
      const params = {
        patient: patientId,
        category: "LAB",
        _sort: "-date",
        _count: "50",
      }

      const result = await fhirService.fetchResource<{ entry?: Array<{ resource: FHIRDiagnosticReport }> }>(
        "DiagnosticReport",
        undefined,
        params,
      )

      if (!result?.entry || result.entry.length === 0) {
        return []
      }

      // Process each report
      const reports: LaboratoryReport[] = []

      for (const entry of result.entry) {
        const report = entry.resource

        // Extract basic report information
        const labReport: LaboratoryReport = {
          id: report.id,
          patientId,
          reportDate: report.effectiveDateTime || report.issued || new Date().toISOString(),
          category: this.extractCategoryDisplay(report),
          code: this.extractCodeValue(report),
          name: this.extractCodeDisplay(report),
          status: report.status,
          performer: report.performer?.[0]?.display,
          conclusion: report.conclusion,
          results: [],
        }

        // Fetch associated results if available
        if (report.result && report.result.length > 0) {
          const resultReferences = report.result.map((ref) => {
            // Extract the resource type and ID from the reference
            const parts = ref.reference.split("/")
            return parts.length === 2 ? parts[1] : ref.reference
          })

          // Fetch each result observation
          for (const resultId of resultReferences) {
            const observation = await fhirService.fetchResource<FHIRObservationResult>("Observation", resultId)

            if (observation) {
              labReport.results.push(this.processObservationResult(observation))
            }
          }
        }

        reports.push(labReport)
      }

      return reports
    } catch (error) {
      console.error("Error fetching laboratory reports:", error)
      return []
    }
  }

  // Fetch Beaker laboratory reports specifically
  async getBeakerLaboratoryReports(patientId: string): Promise<LaboratoryReport[]> {
    try {
      // Search for Beaker laboratory reports specifically
      // Beaker reports typically have a specific code or identifier
      const params = {
        patient: patientId,
        category: "LAB",
        // Add Beaker-specific search parameters
        // This might vary depending on the FHIR implementation
        // Common options include:
        // - system identifier for Beaker
        // - specific code for Beaker reports
        _sort: "-date",
        _count: "50",
      }

      const result = await fhirService.fetchResource<{ entry?: Array<{ resource: FHIRDiagnosticReport }> }>(
        "DiagnosticReport",
        undefined,
        params,
      )

      if (!result?.entry || result.entry.length === 0) {
        return []
      }

      // Filter for Beaker reports
      // This filtering logic will depend on how Beaker reports are identified in your system
      const beakerReports = result.entry.filter((entry) => {
        const report = entry.resource

        // Check if this is a Beaker report
        // This could be based on:
        // 1. A specific system in the coding
        // 2. A specific code value
        // 3. Text in the report name or category
        // 4. A specific tag or identifier

        // Example: Check if any coding has a Beaker-specific system
        const hasBeakerSystem = report.code.coding.some(
          (coding) =>
            coding.system?.includes("beaker") ||
            coding.system?.includes("sunquest") ||
            coding.display?.toLowerCase().includes("beaker"),
        )

        // Example: Check if the report name contains "Beaker"
        const hasBeakerName = report.code.text?.toLowerCase().includes("beaker")

        return hasBeakerSystem || hasBeakerName
      })

      // Process each Beaker report
      const reports: LaboratoryReport[] = []

      for (const entry of beakerReports) {
        const report = entry.resource

        // Extract basic report information
        const labReport: LaboratoryReport = {
          id: report.id,
          patientId,
          reportDate: report.effectiveDateTime || report.issued || new Date().toISOString(),
          category: this.extractCategoryDisplay(report),
          code: this.extractCodeValue(report),
          name: this.extractCodeDisplay(report),
          status: report.status,
          performer: report.performer?.[0]?.display,
          conclusion: report.conclusion,
          results: [],
        }

        // Fetch associated results if available
        if (report.result && report.result.length > 0) {
          const resultReferences = report.result.map((ref) => {
            // Extract the resource type and ID from the reference
            const parts = ref.reference.split("/")
            return parts.length === 2 ? parts[1] : ref.reference
          })

          // Fetch each result observation
          for (const resultId of resultReferences) {
            const observation = await fhirService.fetchResource<FHIRObservationResult>("Observation", resultId)

            if (observation) {
              labReport.results.push(this.processObservationResult(observation))
            }
          }
        }

        reports.push(labReport)
      }

      return reports
    } catch (error) {
      console.error("Error fetching Beaker laboratory reports:", error)
      return []
    }
  }

  // Process an observation into a structured result
  private processObservationResult(observation: FHIRObservationResult): LaboratoryResult {
    // Extract the value based on its type
    let value: string | number | undefined
    let unit: string | undefined

    if (observation.valueQuantity) {
      value = observation.valueQuantity.value
      unit = observation.valueQuantity.unit
    } else if (observation.valueString) {
      value = observation.valueString
    } else if (observation.valueCodeableConcept) {
      value = observation.valueCodeableConcept.text || observation.valueCodeableConcept.coding?.[0]?.display
    }

    // Extract reference range
    const referenceRange = observation.referenceRange?.[0]
    let rangeText: string | undefined

    if (referenceRange) {
      if (referenceRange.text) {
        rangeText = referenceRange.text
      } else if (referenceRange.low && referenceRange.high) {
        rangeText = `${referenceRange.low.value} - ${referenceRange.high.value} ${referenceRange.low.unit || ""}`
      } else if (referenceRange.low) {
        rangeText = `> ${referenceRange.low.value} ${referenceRange.low.unit || ""}`
      } else if (referenceRange.high) {
        rangeText = `< ${referenceRange.high.value} ${referenceRange.high.unit || ""}`
      }
    }

    // Extract interpretation (abnormal flag)
    const interpretation =
      observation.interpretation?.[0]?.text || observation.interpretation?.[0]?.coding?.[0]?.display

    // Determine if result is abnormal
    const abnormal = !!interpretation && !["normal", "N"].includes(interpretation.toLowerCase())

    return {
      id: observation.id,
      code: this.extractCodeValue(observation),
      name: this.extractCodeDisplay(observation),
      value,
      unit,
      referenceRange: rangeText,
      interpretation,
      abnormal,
    }
  }

  // Helper methods to extract common properties
  private extractCategoryDisplay(resource: FHIRDiagnosticReport | FHIRObservationResult): string {
    if (!resource.category || resource.category.length === 0) {
      return "Laboratory"
    }

    const category = resource.category[0]
    return category.coding?.[0]?.display || "Laboratory"
  }

  private extractCodeValue(resource: FHIRDiagnosticReport | FHIRObservationResult): string {
    return resource.code.coding?.[0]?.code || ""
  }

  private extractCodeDisplay(resource: FHIRDiagnosticReport | FHIRObservationResult): string {
    return resource.code.text || resource.code.coding?.[0]?.display || "Unknown Test"
  }
}

// Export singleton instance
export const laboratoryService = new LaboratoryService()


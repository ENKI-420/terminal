import { type FHIRMolecularSequence, type FHIRObservation, fhirService } from "./fhir-service"

// Genomic variant interface
export interface GenomicVariant {
  gene: string
  chromosome?: string
  position?: number
  referenceAllele?: string
  alternateAllele?: string
  type?: string
  clinicalSignificance?: string
  phenotype?: string[]
  interpretation?: string
}

// Genomic report interface
export interface GenomicReport {
  id: string
  patientId: string
  reportDate: string
  variants: GenomicVariant[]
  summary?: string
  recommendations?: string[]
}

// Genomic Service class
export class GenomicService {
  // Process FHIR observations and molecular sequences into a structured genomic report
  async processGenomicData(patientId: string): Promise<GenomicReport | null> {
    try {
      // Fetch genomic observations and molecular sequences
      const observations = await fhirService.getGenomicObservations(patientId)
      const sequences = await fhirService.getMolecularSequences(patientId)

      if (observations.length === 0 && sequences.length === 0) {
        return null
      }

      // Extract variants from observations and sequences
      const variants = this.extractVariants(observations, sequences)

      // Create genomic report
      const report: GenomicReport = {
        id: `report-${Date.now()}`,
        patientId,
        reportDate: new Date().toISOString(),
        variants,
        summary: this.generateSummary(variants),
        recommendations: this.generateRecommendations(variants),
      }

      return report
    } catch (error) {
      console.error("Error processing genomic data:", error)
      return null
    }
  }

  // Extract genomic variants from FHIR resources
  private extractVariants(observations: FHIRObservation[], sequences: FHIRMolecularSequence[]): GenomicVariant[] {
    const variants: GenomicVariant[] = []

    // Extract variants from observations
    observations.forEach((obs) => {
      // Look for genomic variant observations
      if (
        obs.code.coding.some(
          (coding) => coding.system === "http://loinc.org" && ["51969-4", "55233-1", "82810-3"].includes(coding.code),
        )
      ) {
        // Extract gene information
        const geneComponent = obs.component?.find((comp) =>
          comp.code.coding.some(
            (coding) => coding.system === "http://loinc.org" && coding.code === "48018-6", // Gene studied
          ),
        )

        const gene = geneComponent?.valueCodeableConcept?.text || "Unknown"

        // Extract variant information
        const variantComponent = obs.component?.find((comp) =>
          comp.code.coding.some(
            (coding) => coding.system === "http://loinc.org" && coding.code === "81252-9", // Discrete genetic variant
          ),
        )

        const variantText = variantComponent?.valueString || ""

        // Extract clinical significance
        const significanceComponent = obs.component?.find((comp) =>
          comp.code.coding.some(
            (coding) => coding.system === "http://loinc.org" && coding.code === "53037-8", // Clinical significance
          ),
        )

        const clinicalSignificance = significanceComponent?.valueCodeableConcept?.text || ""

        variants.push({
          gene,
          type: "SNV", // Single Nucleotide Variant (default)
          clinicalSignificance,
          interpretation: obs.valueString || "",
        })
      }
    })

    // Extract variants from molecular sequences
    sequences.forEach((seq) => {
      seq.variant?.forEach((variant) => {
        const chromosomeInfo = seq.referenceSeq?.referenceSeqId?.coding.find(
          (coding) => coding.system === "http://www.ncbi.nlm.nih.gov/nuccore",
        )

        variants.push({
          gene: "Unknown", // Gene information might not be directly available in MolecularSequence
          chromosome: chromosomeInfo?.display || "Unknown",
          position: variant.start,
          referenceAllele: variant.referenceAllele,
          alternateAllele: variant.observedAllele,
          type: "Sequence Variant",
        })
      })

      // Extract structural variants
      seq.structureVariant?.forEach((sv) => {
        const svType = sv.variantType?.coding[0]?.display || "Unknown"

        variants.push({
          gene: "Unknown",
          type: `Structural Variant (${svType})`,
          chromosome: seq.referenceSeq?.referenceSeqId?.coding[0]?.display || "Unknown",
        })
      })
    })

    return variants
  }

  // Generate a summary of the genomic findings
  private generateSummary(variants: GenomicVariant[]): string {
    if (variants.length === 0) {
      return "No genomic variants detected."
    }

    const pathogenicVariants = variants.filter((v) => v.clinicalSignificance?.toLowerCase().includes("pathogenic"))

    const vusVariants = variants.filter((v) => v.clinicalSignificance?.toLowerCase().includes("uncertain"))

    const benignVariants = variants.filter((v) => v.clinicalSignificance?.toLowerCase().includes("benign"))

    let summary = `Analysis identified ${variants.length} genomic variants. `

    if (pathogenicVariants.length > 0) {
      summary += `${pathogenicVariants.length} pathogenic or likely pathogenic variants were found`
      if (pathogenicVariants.length <= 3) {
        summary += ` in the following genes: ${pathogenicVariants.map((v) => v.gene).join(", ")}.`
      } else {
        summary += "."
      }
    }

    if (vusVariants.length > 0) {
      summary += ` ${vusVariants.length} variants of uncertain significance were identified.`
    }

    return summary
  }

  // Generate clinical recommendations based on genomic findings
  private generateRecommendations(variants: GenomicVariant[]): string[] {
    const recommendations: string[] = []

    // Check for pathogenic variants
    const pathogenicVariants = variants.filter((v) => v.clinicalSignificance?.toLowerCase().includes("pathogenic"))

    if (pathogenicVariants.length > 0) {
      recommendations.push("Consider genetic counseling to discuss the implications of identified pathogenic variants.")
      recommendations.push("Review family history to identify at-risk relatives who may benefit from genetic testing.")
    }

    // Check for variants of uncertain significance
    const vusVariants = variants.filter((v) => v.clinicalSignificance?.toLowerCase().includes("uncertain"))

    if (vusVariants.length > 0) {
      recommendations.push(
        "Periodic reassessment of variants of uncertain significance is recommended as knowledge evolves.",
      )
    }

    // Add general recommendations
    recommendations.push("Correlate genomic findings with clinical presentation and family history.")

    return recommendations
  }

  // Process uploaded genomic file (CSV, VCF, etc.)
  async processGenomicFile(file: File): Promise<GenomicReport | null> {
    try {
      // Read file content
      const content = await this.readFileContent(file)

      // Determine file type and parse accordingly
      if (file.name.endsWith(".vcf")) {
        return this.parseVCFFile(content)
      } else if (file.name.endsWith(".csv")) {
        return this.parseCSVFile(content)
      } else if (file.name.endsWith(".json")) {
        return this.parseJSONFile(content)
      } else {
        throw new Error("Unsupported file format")
      }
    } catch (error) {
      console.error("Error processing genomic file:", error)
      return null
    }
  }

  // Read file content as text
  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = (e) => reject(e)
      reader.readAsText(file)
    })
  }

  // Parse VCF (Variant Call Format) file
  private parseVCFFile(content: string): GenomicReport {
    // Basic VCF parsing logic
    const lines = content.split("\n").filter((line) => !line.startsWith("#") && line.trim() !== "")

    const variants: GenomicVariant[] = lines
      .map((line) => {
        const fields = line.split("\t")
        if (fields.length < 5) return null

        const [chromosome, position, id, ref, alt, ...rest] = fields

        // Extract info field if available
        const infoField = rest[2] || ""
        const infoMap = new Map<string, string>()
        infoField.split(";").forEach((item) => {
          const [key, value] = item.split("=")
          if (key && value) infoMap.set(key, value)
        })

        return {
          gene: infoMap.get("GENE") || "Unknown",
          chromosome,
          position: Number.parseInt(position),
          referenceAllele: ref,
          alternateAllele: alt,
          type: "SNV",
          clinicalSignificance: infoMap.get("CLNSIG") || "Unknown",
        }
      })
      .filter(Boolean) as GenomicVariant[]

    return {
      id: `report-${Date.now()}`,
      patientId: "file-upload",
      reportDate: new Date().toISOString(),
      variants,
      summary: this.generateSummary(variants),
      recommendations: this.generateRecommendations(variants),
    }
  }

  // Parse CSV file
  private parseCSVFile(content: string): GenomicReport {
    const lines = content.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

    const variants: GenomicVariant[] = []

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue

      const values = lines[i].split(",").map((v) => v.trim())
      const variant: Partial<GenomicVariant> = {}

      headers.forEach((header, index) => {
        if (header === "gene") variant.gene = values[index]
        else if (header === "chromosome") variant.chromosome = values[index]
        else if (header === "position") variant.position = Number.parseInt(values[index])
        else if (header === "ref" || header === "reference") variant.referenceAllele = values[index]
        else if (header === "alt" || header === "alternate") variant.alternateAllele = values[index]
        else if (header === "type") variant.type = values[index]
        else if (header === "significance" || header === "clinical_significance")
          variant.clinicalSignificance = values[index]
      })

      if (variant.gene) {
        variants.push(variant as GenomicVariant)
      }
    }

    return {
      id: `report-${Date.now()}`,
      patientId: "file-upload",
      reportDate: new Date().toISOString(),
      variants,
      summary: this.generateSummary(variants),
      recommendations: this.generateRecommendations(variants),
    }
  }

  // Parse JSON file
  private parseJSONFile(content: string): GenomicReport {
    try {
      const data = JSON.parse(content)

      // Handle different JSON formats
      if (Array.isArray(data)) {
        // Assume array of variants
        const variants = data.map((item) => ({
          gene: item.gene || "Unknown",
          chromosome: item.chromosome,
          position: item.position,
          referenceAllele: item.referenceAllele || item.ref,
          alternateAllele: item.alternateAllele || item.alt,
          type: item.type || "Unknown",
          clinicalSignificance: item.clinicalSignificance || item.significance,
          phenotype: item.phenotype,
          interpretation: item.interpretation,
        }))

        return {
          id: `report-${Date.now()}`,
          patientId: "file-upload",
          reportDate: new Date().toISOString(),
          variants,
          summary: this.generateSummary(variants),
          recommendations: this.generateRecommendations(variants),
        }
      } else if (data.variants) {
        // Assume report format
        return {
          id: data.id || `report-${Date.now()}`,
          patientId: data.patientId || "file-upload",
          reportDate: data.reportDate || new Date().toISOString(),
          variants: data.variants,
          summary: data.summary || this.generateSummary(data.variants),
          recommendations: data.recommendations || this.generateRecommendations(data.variants),
        }
      } else {
        throw new Error("Unrecognized JSON format")
      }
    } catch (error) {
      console.error("Error parsing JSON file:", error)
      throw error
    }
  }
}

// Export singleton instance
export const genomicService = new GenomicService()


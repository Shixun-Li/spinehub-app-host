import fetcher from "@/utils/fetcher";

namespace PatientService {
  export const addPatient = fetcher
    .path("/api/v1/patient")
    .method("post")
    .create();
  export const getPatient = fetcher
    .path("/api/v1/patient")
    .method("get")
    .create();
  export const patientDetail = fetcher
    .path("/api/v1/patient/{patientId}")
    .method("get")
    .create();
  export const editPatientDetail = fetcher
    .path("/api/v1/patient/{patientId}")
    .method("patch")
    .create();
  export const deletePatient = fetcher
    .path("/api/v1/patient/{patientId}")
    .method("delete")
    .create();
  export const activatePatient = fetcher
    .path("/api/v1/patient/{patientId}/activate")
    .method("put")
    .create();
  export const deactivatePatient = fetcher
    .path("/api/v1/patient/{patientId}/deactivate")
    .method("put")
    .create();

  export const addDocument = fetcher
    .path("/api/v1/patient/{patientId}/document")
    .method("post")
    .create();
  export const getDocument = fetcher
    .path("/api/v1/patient/{patientId}/document")
    .method("get")
    .create();
  export const getDocumentDetail = fetcher
    .path("/api/v1/patient/{patientId}/document/{documentId}")
    .method("get")
    .create();
  export const deleteDocumen = fetcher
    .path("/api/v1/patient/{patientId}/document/{documentId}")
    .method("delete")
    .create();
}
export default PatientService;

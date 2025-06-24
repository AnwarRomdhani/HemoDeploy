import api from './api';

export const getPatients = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}patients/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch patients.' };
  }
};

export const getPatientDetails = async (apiBaseUrl, token, patientId) => {
  try {
    const response = await api.get(`${apiBaseUrl}patients/${patientId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch patient details.' };
  }
};

export const declarePatientDeceased = async (apiBaseUrl, token, patientId, deceaseNote) => {
  try {
    const response = await api.post(`${apiBaseUrl}declare-deceased/${patientId}/`, {
      decease_note: deceaseNote || '',
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to declare patient deceased.' };
  }
};

export const addHemodialysisSession = async (apiBaseUrl, token, patientId, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-hemodialysis-session/${patientId}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to add hemodialysis session.' };
  }
};

export const addTransmittableDisease = async (apiBaseUrl, token, patientId, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-transmittable-disease/${patientId}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to add transmittable disease.' };
  }
};

export const addComplications = async (apiBaseUrl, token, patientId, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-complications/${patientId}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to add complication.' };
  }
};

export const addTransplantation = async (apiBaseUrl, token, patientId, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-transplantation/${patientId}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to add transplantation.' };
  }
};

export const getDoctors = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}medical-staff/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch medical staff.' };
  }
};

export const getTypeHemo = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}type-hemo/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch type hemo.' };
  }
};

export const getMethodHemo = async (apiBaseUrl, token, typeHemoId = null) => {
  try {
    const url = typeHemoId ? `${apiBaseUrl}method-hemo/?type_hemo_id=${typeHemoId}` : `${apiBaseUrl}method-hemo/`;
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch method hemo.' };
  }
};

export const getTransmittableDiseaseRef = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}transmittable-disease-ref/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch transmittable disease ref.' };
  }
};

export const getComplicationsRef = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}complications-ref/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch complications ref.' };
  }
};

export const getTransplantationRef = async (apiBaseUrl, token) => {
  try {
    const response = await api.get(`${apiBaseUrl}transplantation-ref/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to fetch transplantation ref.' };
  }
};

export const addTransmittableDiseaseRef = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-transmittable-disease-ref/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to add transmittable disease ref.' };
  }
};

export const addComplicationsRef = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-complications-ref/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to add complications ref.' };
  }
};

export const addTransplantationRef = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(`${apiBaseUrl}add-transplantation-ref/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Failed to add transplantation ref.' };
  }
};

export const addPatient = async (apiBaseUrl, token, data) => {
  try {
    const response = await api.post(
      `${apiBaseUrl}add-patient/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.errors || error.message };
  }
};
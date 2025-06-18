import api from './api';

export const getPatients = async (apiBaseUrl, token) => {
  console.log('Fetching patients:', { apiBaseUrl });
  try {
    const response = await api.get(`${apiBaseUrl}patients/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Patients response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Patients error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch patients.' };
  }
};

export const getPatientDetails = async (apiBaseUrl, token, patientId) => {
  console.log('Fetching patient details:', { apiBaseUrl, patientId });
  try {
    const response = await api.get(`${apiBaseUrl}patients/${patientId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Patient details response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Patient details error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch patient details.' };
  }
};

export const declarePatientDeceased = async (apiBaseUrl, token, patientId, deceaseNote) => {
  console.log('Declaring patient deceased:', { apiBaseUrl, patientId });
  try {
    const response = await api.post(`${apiBaseUrl}declare-deceased/${patientId}/`, {
      decease_note: deceaseNote || '',
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Declare deceased response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Declare deceased error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to declare patient deceased.' };
  }
};

export const addHemodialysisSession = async (apiBaseUrl, token, patientId, data) => {
  console.log('Adding hemodialysis session:', { apiBaseUrl, patientId });
  try {
    const response = await api.post(`${apiBaseUrl}add-hemodialysis-session/${patientId}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Hemodialysis session response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Hemodialysis session error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to add hemodialysis session.' };
  }
};

export const addTransmittableDisease = async (apiBaseUrl, token, patientId, data) => {
  console.log('Adding transmittable disease:', { apiBaseUrl, patientId });
  try {
    const response = await api.post(`${apiBaseUrl}add-transmittable-disease/${patientId}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Transmittable disease response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Transmittable disease error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to add transmittable disease.' };
  }
};

export const addComplications = async (apiBaseUrl, token, patientId, data) => {
  console.log('Adding complication:', { apiBaseUrl, patientId });
  try {
    const response = await api.post(`${apiBaseUrl}add-complications/${patientId}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Complication response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Complication error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to add complication.' };
  }
};

export const addTransplantation = async (apiBaseUrl, token, patientId, data) => {
  console.log('Adding transplantation:', { apiBaseUrl, patientId });
  try {
    const response = await api.post(`${apiBaseUrl}add-transplantation/${patientId}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Transplantation response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Transplantation error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to add transplantation.' };
  }
};

export const getDoctors = async (apiBaseUrl, token) => {
  console.log('Fetching medical staff:', { apiBaseUrl });
  try {
    const response = await api.get(`${apiBaseUrl}medical-staff/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Medical staff response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Medical staff error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch medical staff.' };
  }
};

export const getTypeHemo = async (apiBaseUrl, token) => {
  console.log('Fetching type hemo:', { apiBaseUrl });
  try {
    const response = await api.get(`${apiBaseUrl}type-hemo/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Type hemo response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Type hemo error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch type hemo.' };
  }
};

export const getMethodHemo = async (apiBaseUrl, token, typeHemoId = null) => {
  console.log('Fetching method hemo:', { apiBaseUrl, typeHemoId });
  try {
    const url = typeHemoId ? `${apiBaseUrl}method-hemo/?type_hemo_id=${typeHemoId}` : `${apiBaseUrl}method-hemo/`;
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Method hemo response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Method hemo error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch method hemo.' };
  }
};

export const getTransmittableDiseaseRef = async (apiBaseUrl, token) => {
  console.log('Fetching transmittable disease ref:', { apiBaseUrl });
  try {
    const response = await api.get(`${apiBaseUrl}transmittable-disease-ref/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Transmittable disease ref response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Transmittable disease ref error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch transmittable disease ref.' };
  }
};

export const getComplicationsRef = async (apiBaseUrl, token) => {
  console.log('Fetching complications ref:', { apiBaseUrl });
  try {
    const response = await api.get(`${apiBaseUrl}complications-ref/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Complications ref response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Complications ref error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch complications ref.' };
  }
};

export const getTransplantationRef = async (apiBaseUrl, token) => {
  console.log('Fetching transplantation ref:', { apiBaseUrl });
  try {
    const response = await api.get(`${apiBaseUrl}transplantation-ref/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Transplantation ref response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Transplantation ref error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to fetch transplantation ref.' };
  }
};

export const addTransmittableDiseaseRef = async (apiBaseUrl, token, data) => {
  console.log('Adding transmittable disease ref:', { apiBaseUrl, data });
  try {
    const response = await api.post(`${apiBaseUrl}add-transmittable-disease-ref/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Add transmittable disease ref response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Add transmittable disease ref error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to add transmittable disease ref.' };
  }
};

export const addComplicationsRef = async (apiBaseUrl, token, data) => {
  console.log('Adding complications ref:', { apiBaseUrl, data });
  try {
    const response = await api.post(`${apiBaseUrl}add-complications-ref/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Add complications ref response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Add complications ref error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data?.error || 'Failed to add complications ref.' };
  }
};

export const addTransplantationRef = async (apiBaseUrl, token, data) => {
  console.log('Adding transplantation ref:', { apiBaseUrl, data });
  try {
    const response = await api.post(`${apiBaseUrl}add-transplantation-ref/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Add transplantation ref response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Add transplantation ref error:', error.response?.data || error.message);
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
    console.error('Error adding patient:', error.response?.data);
    return { success: false, error: error.response?.data?.errors || error.message };
  }
};

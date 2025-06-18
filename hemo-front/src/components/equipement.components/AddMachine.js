import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import Modal from '../Patients.components/Modal';


const AddMachine = () => {
  const { apiBaseUrl } = useContext(TenantContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState( true); // Open modal by default; can be toggled via button
  const [formData, setFormData] = useState({
    brand: '',
    functional: false,
    reserve: false,
    refurbished: false,
    nbre_hrs: '',
    membrane: '',
    filtre: '',
  });
  const [membranes, setMembranes] = useState([]);
  const [filtres, setFiltres] = useState([]);
  const [newMembrane, setNewMembrane] = useState({ type: '' });
  const [newFiltre, setNewFiltre] = useState({ type: '', sterilisation: '' });
  const [showNewMembraneForm, setShowNewMembraneForm] = useState(false);
  const [showNewFiltreForm, setShowNewFiltreForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const fetchOptions = async () => {
    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setErrors({ general: 'No token found. Please log in.' });
      return;
    }

    try {
      const [membraneRes, filtreRes] = await Promise.all([
        axios.get(`${apiBaseUrl}membranes/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiBaseUrl}filtres/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setMembranes(membraneRes.data);
      setFiltres(filtreRes.data);
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Failed to fetch options.' });
    }
  };

  useEffect(() => {
    fetchOptions();
  }, [apiBaseUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNewMembraneChange = (e) => {
    const { name, value } = e.target;
    setNewMembrane((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewFiltreChange = (e) => {
    const { name, value } = e.target;
    setNewFiltre((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMembrane = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setErrors({ general: 'No token found. Please log in.' });
      return;
    }

    if (!newMembrane.type) {
      setErrors({ membrane: 'Membrane type is required.' });
      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}add-membrane/`,
        { type: newMembrane.type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMembranes([...membranes, response.data]);
      setFormData((prev) => ({ ...prev, membrane: response.data.id }));
      setNewMembrane({ type: '' });
      setShowNewMembraneForm(false);
      setSuccess('Membrane added successfully!');
    } catch (err) {
      setErrors({ membrane: err.response?.data?.error || 'Failed to add membrane.' });
    }
  };

  const handleAddFiltre = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setErrors({ general: 'No token found. Please log in.' });
      return;
    }

    if (!newFiltre.type) {
      setErrors({ filtre: 'Filtre type is required.' });
      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}add-filtre/`,
        { type: newFiltre.type, sterilisation: newFiltre.sterilisation || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFiltres([...filtres, response.data]);
      setFormData((prev) => ({ ...prev, filtre: response.data.id }));
      setNewFiltre({ type: '', sterilisation: '' });
      setShowNewFiltreForm(false);
      setSuccess('Filtre added successfully!');
    } catch (err) {
      setErrors({ filtre: err.response?.data?.error || 'Failed to add filtre.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(null);

    const token = localStorage.getItem('tenant-token');
    if (!token) {
      setErrors({ general: 'No token found. Please log in.' });
      return;
    }

    try {
      await axios.post(
        `${apiBaseUrl}add-machine/`,
        {
          brand: formData.brand,
          functional: formData.functional,
          reserve: formData.reserve,
          refurbished: formData.refurbished,
          nbre_hrs: formData.nbre_hrs,
          membrane: formData.membrane || null,
          filtre: formData.filtre || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Machine added successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/home/equipment/list');
      }, 2000);
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Failed to add machine.' });
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    navigate('/home/equipment/list');
  };

  return (
    <div>
      {/* Button to trigger modal (e.g., from equipment list page) */}
      <button onClick={() => setIsModalOpen(true)} className="action-button">
        Add Machine
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title="Add New Machine"
      >
        {errors.general && <div className="error">{errors.general}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Functional
              <input
                type="checkbox"
                name="functional"
                checked={formData.functional}
                onChange={handleChange}
                className="ml-2"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reserve
              <input
                type="checkbox"
                name="reserve"
                checked={formData.reserve}
                onChange={handleChange}
                className="ml-2"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Refurbished
              <input
                type="checkbox"
                name="refurbished"
                checked={formData.refurbished}
                onChange={handleChange}
                className="ml-2"
              />
            </label>
          </div>
          <div>
            <label htmlFor="nbre_hrs" className="block text-sm font-medium text-gray-700">
              Hours
            </label>
            <input
              type="number"
              id="nbre_hrs"
              name="nbre_hrs"
              value={formData.nbre_hrs}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="membrane" className="block text-sm font-medium text-gray-700">
              Membrane
            </label>
            <div className="flex space-x-2">
              <select
                id="membrane"
                name="membrane"
                value={formData.membrane}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                disabled={showNewMembraneForm}
              >
                <option value="">None</option>
                {membranes.map((membrane) => (
                  <option key={membrane.id} value={membrane.id}>
                    {membrane.type}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="action-button"
                onClick={() => setShowNewMembraneForm(!showNewMembraneForm)}
              >
                {showNewMembraneForm ? 'Cancel' : 'Add New'}
              </button>
            </div>
            {showNewMembraneForm && (
              <div className="mt-2 space-y-2">
                {errors.membrane && <div className="error">{errors.membrane}</div>}
                <input
                  type="text"
                  name="type"
                  value={newMembrane.type}
                  onChange={handleNewMembraneChange}
                  placeholder="Membrane Type"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                <button
                  type="button"
                  className="action-button"
                  onClick={handleAddMembrane}
                >
                  Save Membrane
                </button>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="filtre" className="block text-sm font-medium text-gray-700">
              Filtre
            </label>
            <div className="flex space-x-2">
              <select
                id="filtre"
                name="filtre"
                value={formData.filtre}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                disabled={showNewFiltreForm}
              >
                <option value="">None</option>
                {filtres.map((filtre) => (
                  <option key={filtre.id} value={filtre.id}>
                    {filtre.type} {filtre.sterilisation ? `(${filtre.sterilisation})` : ''}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="action-button"
                onClick={() => setShowNewFiltreForm(!showNewFiltreForm)}
              >
                {showNewFiltreForm ? 'Cancel' : 'Add New'}
              </button>
            </div>
            {showNewFiltreForm && (
              <div className="mt-2 space-y-2">
                {errors.filtre && <div className="error">{errors.filtre}</div>}
                <input
                  type="text"
                  name="type"
                  value={newFiltre.type}
                  onChange={handleNewFiltreChange}
                  placeholder="Filtre Type"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                <input
                  type="text"
                  name="sterilisation"
                  value={newFiltre.sterilisation}
                  onChange={handleNewFiltreChange}
                  placeholder="Sterilisation (optional)"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                <button
                  type="button"
                  className="action-button"
                  onClick={handleAddFiltre}
                >
                  Save Filtre
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="action-button">
              Add Machine
            </button>
            <button
              type="button"
              className="action-button cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddMachine;
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const extractTasks = async (text) => {
  const response = await api.post('/extract-tasks', { text });
  return response.data.tasks;
};

export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  
  const response = await api.post('/transcribe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data; // should return { text, tasks }
};

export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (id, updates) => {
  const response = await api.patch(`/tasks/${id}`, updates);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export default api;

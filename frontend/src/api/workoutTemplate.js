import apiConfig from './config'

export const createWorkoutTemplate = async (data) => {
  const response = await apiConfig.post('/workout/template', data)
  return response
}

export const getAllWorkoutTemplates = async () => {
  const response = await apiConfig.get('/workout/template')
  const templates = response.data.data
  return templates
}

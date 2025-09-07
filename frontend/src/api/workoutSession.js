import apiConfig from './config'

export const createWorkoutSession = async (data) => {
  const response = await apiConfig.post('/workout/session', data)
  return response
}

export const getWorkoutSessions = async (page = 1, limit = 6, name = '') => {
  const response = await apiConfig.get(
    `/workout/session?page=${page}&limit=${limit}&templateName=${name}`,
  )
  const data = response.data.data
  return data
}

export const deleteSession = async (id) => {
  return await apiConfig.delete(`/workout/session/${id}`)
}

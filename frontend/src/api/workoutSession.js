import apiConfig from './config'

export const createWorkoutSession = async (data) => {
  const response = await apiConfig.post('/workout/session', data)
  console.log(response)
  return response
}

export const getWorkoutSessions = async () => {
  const response = await apiConfig.get('/workout/session')
  const sessions = response.data.data
  console.log(sessions)
  return sessions
}

import apiConfig from './config'

export const signUp = async (data) => {
  return await apiConfig.post('/auth/signup', data)
}
export const login = async (data) => {
  return await apiConfig.post('/auth/login', data)
}

export const fetchUser = async () => {
  const response = await apiConfig.get('/auth/me')
  const {
    data: { user },
  } = response.data
  return user
}

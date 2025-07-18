import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'http://10.0.2.2:7060/api/AccountApi'
//const API_URL = 'http://localhost:7060/api/AccountApi/Login'

export const login = async (soDienThoai, matKhau) => {
  console.log('Gọi API:', BASE_URL)

  try {
    const response = await axios.post(`${BASE_URL}/Login`, { soDienThoai, matKhau })
    await AsyncStorage.setItem('token', response.data.token)
    //console.log('Dữ liệu trả về:', response.data)
    return response.data
  } catch (error) {
    console.log('Lỗi khi gọi API', error)
    throw error
  }
}

export const logout = async () => {
  await AsyncStorage.removeItem('token')
  await AsyncStorage.removeItem('expiresAt')
  await AsyncStorage.removeItem('user')
}

export const isLoggedIn = async () => {
  const token = await AsyncStorage.getItem('token')
  if (token) {
    return true
  }
  return false
}

export const sendOtpToResetPassword = async (soDienThoai) => {
  console.log('SDT: ', soDienThoai)
  const response = await axios.post(
    `${BASE_URL}/SendOtpToResetPassword`,
    { soDienThoai }
  )
  return response.data
}

export const resetPasswordWithOtp = async ({ soDienThoai, otp, newPassword }) => {
  console.log('Gửi dữ liệu:', { soDienThoai, otp, newPassword }) // debug
  const response = await axios.post(
    `${BASE_URL}/ResetPasswordWithOtp`,
    {
      soDienThoai,
      otp,
      newPassword
    }
  )
  console.log('response: ', response)
  return response.data
}
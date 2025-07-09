import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'http://10.0.2.2:7060/api/MedicalRecord'

export const getMedicalRecords = async () => {
  const token = await AsyncStorage.getItem('token')
  const { data } = await axios.get(BASE_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
  return data
}

export const getMedicalRecordsById = async(id) => {
    try{
        const token = await AsyncStorage.getItem('token')
        const respone = await axios.get(`${BASE_URL}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return respone.data
    }catch(error){
        console.log('Lỗi khi gọi API', error)
        throw error
    }
}
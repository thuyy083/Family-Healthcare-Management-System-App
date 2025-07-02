import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'http://10.0.2.2:7060/api/Doctors'

export const getAllDoctor = async (maChuyenKhoa = '', search = '') => {
    try {
        const url = `${BASE_URL}?maChuyenKhoa=${maChuyenKhoa}&search=${encodeURIComponent(search)}`
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.log('Lỗi khi gọi API', error)
        throw error
    }
}

export const getAllSpecialties = async() => {
    try{
        const url = `${BASE_URL}/Specialty`
        const respone = await axios.get(url)
        return respone.data
    }catch (error){
        console.log('Lỗi khi gọi API', error)
        throw error
    }
}

export const getDoctorById = async(maTk) => {
    try{
        const respone = await axios.get(`${BASE_URL}/${maTk}`)
        return respone.data
    }catch(error){
        console.log('Lỗi khi gọi API', error)
        throw error
    }
}
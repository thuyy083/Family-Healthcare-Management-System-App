import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Appbar } from 'react-native-paper'
import { getDoctorById } from '../../services/doctorService'
import moment from 'moment'

const DoctorDetailScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { maTk } = route.params
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await getDoctorById(maTk)
        setDoctor(data)
      } catch (err) {
        console.log('Lỗi khi tải chi tiết bác sĩ:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctor()
  }, [maTk])

  if (loading) {
    return <ActivityIndicator size="large" color="#0077aa" style={{ marginTop: 20 }} />
  }

  if (!doctor) {
    return <Text style={{ padding: 16 }}>Không thể tải thông tin bác sĩ.</Text>
  }

  const avatarUri = `http://10.0.2.2:7060/images/bacsi/${doctor.hinhAnh}`
  const gioiTinh = doctor.gioiTinh === 0 ? 'Nữ' : 'Nam'
  const ngaySinh = moment(doctor.ngaySinh).format('DD/MM/YYYY')

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Chi tiết bác sĩ" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <View style={styles.container}>
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <Text style={styles.name}>{doctor.hoTen}</Text>
        <Text style={styles.detail}>Chuyên khoa: {doctor.chuyenKhoa}</Text>
        <Text style={styles.detail}>Giới tính: {gioiTinh}</Text>
        <Text style={styles.detail}>Ngày sinh: {ngaySinh}</Text>
        <Text style={styles.detail}>Số điện thoại: {doctor.soDienThoai}</Text>
        <Text style={styles.detail}>Email: {doctor.email}</Text>
        <Text style={styles.detail}>Trình độ: {doctor.trinhDo || 'Chưa cập nhật'}</Text>
        
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f9ff',
    flex: 1
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8
  },
  detail: {
    fontSize: 16,
    marginBottom: 6
  }
})

export default DoctorDetailScreen

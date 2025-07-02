import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { Appbar } from 'react-native-paper'
import { getAllDoctor, getAllSpecialties } from '../../services/doctorService'
import { Picker } from '@react-native-picker/picker'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
import moment from 'moment'
import Layout from '../../components/Layout'
import { SafeAreaView } from 'react-native-safe-area-context'


const DoctorListScreen = () => {
  const [doctors, setDoctors] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await getAllSpecialties()
        setSpecialties(data)
      } catch (err) {
        console.log('Lỗi tải chuyên khoa:', err)
      }
    }

    fetchSpecialties()
  }, [])

  useEffect(() => {
    fetchDoctors()
  }, [selectedSpecialty, search])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const data = await getAllDoctor(selectedSpecialty, search)
      setDoctors(data)
    } catch (err) {
      console.log('Lỗi tải danh sách bác sĩ:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderDoctor = ({ item }) => {
    const avatarUri = `http://10.0.2.2:7060/images/bacsi/${item.hinhAnh}`
    const gioiTinhText = item.gioiTinh === 0 ? 'Nữ' : 'Nam'
    const ngaySinhText =
      item.ngaySinh === '0001-01-01T00:00:00'
        ? 'Chưa cập nhật'
          : moment(item.ngaySinh).format('DD/MM/YYYY')

    return (
      <TouchableOpacity onPress={() => navigation.navigate('DoctorDetail', { maTk: item.maTk })}>
        <View style={styles.card}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.hoTen}</Text>
            <Text style={styles.detail}>Chuyên khoa: {item.chuyenKhoa}</Text>
            <Text style={styles.detail}>Ngày sinh: {ngaySinhText}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Layout>

      <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
        <Appbar.Content title="Danh sách bác sĩ" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm theo tên"
          value={search}
          onChangeText={setSearch}
        />

        <Picker
          selectedValue={selectedSpecialty}
          onValueChange={(value) => setSelectedSpecialty(value)}
          style={styles.picker}
        >
          <Picker.Item label="Tất cả chuyên khoa" value="" />
          {specialties.map((s) => (
            <Picker.Item key={s.maCK} label={s.tenCK} value={s.maCK} />
          ))}
        </Picker>

        {loading ? (
          <ActivityIndicator size="large" color="#0077aa" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={doctors}
            keyExtractor={(item) => item.maTk.toString()}
            renderItem={renderDoctor}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#f0f9ff',
    flex: 1
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  picker: {
    backgroundColor: '#fff',
    marginBottom: 10
  },
  list: {
    paddingBottom: 16
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12
  },
  info: {
    flex: 1,
    justifyContent: 'center'
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 2
  }
})

export default DoctorListScreen

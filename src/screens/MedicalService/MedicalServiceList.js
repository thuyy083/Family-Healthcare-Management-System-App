import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from 'react-native'
import { Appbar } from 'react-native-paper'
import { getAllMedicalService } from '../../services/medicalService'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
import Layout from '../../components/Layout'

const MedicalServiceListScreen = () => {
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    fetchServices()
  }, [search])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const data = await getAllMedicalService(search)
      setServices(data)
    } catch (err) {
      console.log('Lỗi khi tải dịch vụ:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderService = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('MedicalServiceDetail', { maDV: item.maDV })}>
        <View style={styles.card}>
        <Text style={styles.name}>{item.tenDV}</Text>
        <Text style={styles.detail}>Đơn vị: {item.dvt}</Text>
        </View>
    </TouchableOpacity>
  )

  return (
    <Layout>
      <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
        <Appbar.Content title="Dịch vụ y tế" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm dịch vụ..."
          value={search}
          onChangeText={setSearch}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0077aa" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item.maDV.toString()}
            renderItem={renderService}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f9ff'
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  list: {
    paddingBottom: 16
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    elevation: 2
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4
  }
})

export default MedicalServiceListScreen

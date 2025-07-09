import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import { getMedicalRecords } from '../../services/medicalRecordService'

const MedicalRecordListScreen = () => {
  const navigation = useNavigation()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  /* ---- gọi API khi màn hình mount ---- */
  useEffect(() => {
    (async () => {
      try {
        const data = await getMedicalRecords()
        setRecords(data)
      } catch (e) {
        console.log('Lỗi lấy hồ sơ y tế:', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>
        Ngày khám:{' '}
        {moment(item.ngayKham).format('HH:mm ‒ DD/MM/YYYY')}
      </Text>

      <Text style={styles.label}>
        Chẩn đoán:{' '}
        <Text style={styles.value}>{item.chanDoan}</Text>
      </Text>

      <Text style={styles.label}>
        Bác sĩ:{' '}
        <Text style={styles.value}>{item.bacSi}</Text>
      </Text>

      <Text style={styles.label}>
        Ngày tái khám:{' '}
        <Text style={styles.value}>
          {item.ngayTaiKham
            ? moment(item.ngayTaiKham).format('DD/MM/YYYY')
            : '—'}
        </Text>
      </Text>
    </View>
  )

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color="#fff"
        />
        <Appbar.Content
          title="Hồ sơ y tế"
          titleStyle={{ color: '#fff' }}
        />
      </Appbar.Header>

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 32 }}
          size="large"
          color="#0077aa"
        />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </>
  )
}

export default MedicalRecordListScreen

const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: '#f0f9ff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
  },
  date: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#0077aa',
  },
  label: {
    fontSize: 15,
    marginBottom: 4,
    color: '#555',
  },
  value: {
    fontWeight: '600',
    color: '#222',
  },
})

import React, { useEffect, useState } from 'react'
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TextInput, ScrollView, TouchableOpacity
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { Appbar } from 'react-native-paper'
import { getAllBookService } from '../../services/bookSerService'
import moment from 'moment'
import Layout from '../../components/Layout'
import { useNavigation } from '@react-navigation/native'

const BookServiceListScreen = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [status, setStatus] = useState('')
  const navigation = useNavigation()

  useEffect(() => {
    fetchBookings()
  }, [month, year, status])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await getAllBookService(month, year, status)
      setBookings(data)
    } catch (err) {
      console.log('Lỗi khi tải danh sách dịch vụ đã đặt:', err)
    } finally {
      setLoading(false)
    }
  }
  const getStatusInfo = (val) => {
    switch (val) {
      case 0: return { label: 'Chờ duyệt', bg: '#FFF4CC', color: '#B58900' }
      case 1: return { label: 'Đã duyệt', bg: '#E6F7E9', color: '#2E7D32' }
      case 2: return { label: 'Từ chối', bg: '#FDEAEA', color: '#C62828' }
      case 3: return { label: 'Đã hủy', bg: '#ECEFF1', color: '#546E7A' }
      default: return { label: 'Không rõ', bg: '#ECEFF1', color: '#546E7A' }
    }
  }

  const renderBooking = ({ item }) => {
    const s = getStatusInfo(item.trangThai);
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('BookServiceDetail', { maDon: item.maDon })
        }
      >
        <View style={styles.card}>
          {/* header */}
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.tenDV}</Text>
            <View style={[styles.chip, { backgroundColor: s.bg }]}>
              <Text style={[styles.chipText, { color: s.color }]}>{s.label}</Text>
            </View>
          </View>

          {/* body */}
          <View style={styles.cardBody}>
            <Text style={styles.text}>
              <Text style={styles.label}>Thời gian:&nbsp;</Text>
              {moment(item.ngayBD).format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.label}>Đơn giá:&nbsp;</Text>
              {(item.tongTien ?? 0).toLocaleString()} đ
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }


  return (
    <Layout>
      <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
        <Appbar.Content title="Dịch vụ đã đặt" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0077aa" style={{ marginTop: 24 }} />
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderBooking}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListHeaderComponent={() => (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterRow}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                <TextInput
                  placeholder="Tháng"
                  style={[styles.input, { width: 90, height: 40 }]}
                  keyboardType="numeric"
                  value={month}
                  onChangeText={setMonth}
                />
                <TextInput
                  placeholder="Năm"
                  style={[styles.input, { width: 90, height: 40 }]}
                  keyboardType="numeric"
                  value={year}
                  onChangeText={setYear}
                />
                <View style={{ width: 155, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#B0C4DE', marginRight: 10, justifyContent: 'center', overflow: 'hidden' }}>
                  <Picker
                    selectedValue={status}
                    onValueChange={setStatus}
                    style={{
                      color: '#333',
                      fontSize: 16,
                      paddingVertical: 0,
                    }}
                    itemStyle={{
                      fontSize: 16,
                      height: 50,
                    }}
                    dropdownIconColor="#000"
                    mode="dropdown"
                  >
                    <Picker.Item label="Tất cả" value="" />
                    <Picker.Item label="Chờ duyệt" value="0" />
                    <Picker.Item label="Đã duyệt" value="1" />
                    <Picker.Item label="Từ chối" value="2" />
                    <Picker.Item label="Đã hủy" value="3" />
                  </Picker>
                </View>
              </ScrollView>
            )}
          />
        )}
      </View>
    </Layout>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F9FC',
    padding: 16,
  },
  filterRow: { marginBottom: 12 },
  input: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B0C4DE',
    marginRight: 10,
  },

  /* card */
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  chip: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  chipText: { fontSize: 12, fontWeight: '600' },
  title: { fontSize: 16, fontWeight: '700', color: '#004d66', flex: 1, paddingRight: 8 },

  cardBody: { paddingHorizontal: 14, paddingBottom: 12, paddingTop: 6 },
  label: { fontWeight: '600', color: '#333' },
  text: { fontSize: 14, color: '#333', marginTop: 2 },
})

export default BookServiceListScreen

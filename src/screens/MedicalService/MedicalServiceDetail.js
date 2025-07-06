import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import { Appbar } from 'react-native-paper'
import { useRoute, useNavigation } from '@react-navigation/native'
import { getMedicalServiceById } from '../../services/medicalService'
import moment from 'moment'

const MedicalServiceDetailScreen = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { maDV } = route.params

  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getMedicalServiceById(maDV)
        setService(data)
      } catch (err) {
        console.log('Lỗi tải chi tiết dịch vụ:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [maDV])

  if (loading) {
    return <ActivityIndicator size="large" color="#0077aa" style={{ marginTop: 20 }} />
  }

  if (!service) {
    return <Text style={{ padding: 16 }}>Không thể tải thông tin dịch vụ.</Text>
  }

  const km = service.khuyenMai
  const comments = service.comments || []

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Chi tiết dịch vụ" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

<ScrollView style={styles.container}>
  <View style={styles.card}>
    <Text style={styles.title}>{service.tenDV}</Text>

    <View style={styles.priceRow}>
      {km ? (
        <>
          <Text style={[styles.text, styles.oldPrice]}>
            {service.donGiaGanNhat.toLocaleString()}đ
          </Text>
          <Text style={styles.salePrice}>
            {(service.donGiaGanNhat * (1 - km.giamGia / 100)).toLocaleString()}đ / {service.dvt}
          </Text>
        </>
      ) : (
        <Text style={styles.text}>
          {service.donGiaGanNhat.toLocaleString()}đ / {service.dvt}
        </Text>
      )}
    </View>

    <Text style={styles.text}>Mô tả: {service.moTa || 'Không có mô tả'}</Text>
  </View>

  {km && (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>🎁 Khuyến mãi</Text>
      <Text style={styles.text}>Tên: {km.tenKM}</Text>
      <Text style={styles.text}>Giảm giá: {km.giamGia}%</Text>
      <Text style={styles.text}>Từ: {moment(km.ngayBD).format('DD/MM/YYYY')} đến {moment(km.ngayKT).format('DD/MM/YYYY')}</Text>
      <Text style={styles.text}>Mô tả: {km.mota}</Text>
    </View>
  )}

  <View style={styles.card}>
    <Text style={styles.sectionTitle}>💬 Đánh giá</Text>
    {comments.length === 0 ? (
      <Text style={styles.text}>Chưa có đánh giá nào.</Text>
    ) : (
      comments.map((c) => (
        <View key={c.maBL} style={styles.comment}>
          <Text style={styles.commentName}>{c.tenKH}</Text>
          <Text style={styles.text}>
            {moment(c.thoiGian).format('HH:mm DD/MM/YYYY')} - {c.danhGia}⭐
          </Text>
          <Text style={styles.text}>{c.noiDung}</Text>
        </View>
      ))
    )}
  </View>

  <View style={{ padding: 16 }}>
    <Text
      onPress={() => navigation.navigate('BookServiceById', { id: service.maDV })}
      style={styles.button}
    >
      Đặt dịch vụ
    </Text>
  </View>
</ScrollView>

    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5f4fb'
  },
  card: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 3
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0077aa',
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0077aa'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 16
  },
  salePrice: {
    fontSize: 18,
    color: '#d90429',
    fontWeight: 'bold',
    marginLeft: 10
  },
  comment: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#0077aa'
  },
  commentName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#444'
  },
  button: {
    backgroundColor: '#0077aa',
    color: '#fff',
    paddingVertical: 14,
    textAlign: 'center',
    borderRadius: 8,
    fontSize: 17,
    fontWeight: 'bold',
    shadowColor: '#000',
    elevation: 3
  }
})


export default MedicalServiceDetailScreen

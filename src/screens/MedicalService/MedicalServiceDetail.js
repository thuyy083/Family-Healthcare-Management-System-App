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
        <Text style={styles.title}>{service.tenDV}</Text>
        <Text style={styles.text}>Đơn vị: {service.dvt}</Text>
        <Text style={styles.text}>Giá gần nhất: {service.donGiaGanNhat.toLocaleString()} đ</Text>
        <Text style={styles.text}>Mô tả: {service.moTa || 'Không có mô tả'}</Text>

        {km && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Khuyến mãi</Text>
            <Text style={styles.text}>Tên: {km.tenKM}</Text>
            <Text style={styles.text}>Giảm giá: {km.giamGia}%</Text>
            <Text style={styles.text}>Từ: {moment(km.ngayBD).format('DD/MM/YYYY')} đến {moment(km.ngayKT).format('DD/MM/YYYY')}</Text>
            <Text style={styles.text}>Mô tả: {km.mota}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đánh giá</Text>
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
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f9ff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    marginBottom: 6
  },
  section: {
    marginTop: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  comment: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    elevation: 1
  },
  commentName: {
    fontWeight: 'bold'
  }
})

export default MedicalServiceDetailScreen

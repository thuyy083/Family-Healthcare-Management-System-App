import React from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  ToastAndroid
} from 'react-native'
import { sendOtpToResetPassword } from '../../services/authService'
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const ChangePassword = () => {
  const navigation = useNavigation()
  const currentUser = useSelector(state => state.user.currentUser)
  const soDienThoai = currentUser?.soDienThoai || ''

  const handleSendOtp = async () => {
    try {
      const result = await sendOtpToResetPassword(soDienThoai)
      ToastAndroid.show(result.message || 'Mã OTP đã được gửi.', ToastAndroid.LONG)

      // ✅ Chuyển sang màn hình nhập OTP và mật khẩu mới
      navigation.navigate('ResetPassword', { soDienThoai })
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Không thể gửi mã OTP. Vui lòng thử lại.'
      ToastAndroid.show(message, ToastAndroid.LONG)
    }
  }

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Đổi mật khẩu" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>

      <View style={styles.container}>
        <Text style={styles.label}>
          Bấm nút bên dưới để nhận mã OTP về số điện thoại:
        </Text>
        <Text style={styles.phone}>{soDienThoai}</Text>
        <Button title="Gửi mã OTP" onPress={handleSendOtp} />
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
  label: {
    marginBottom: 8,
    fontSize: 16
  },
  phone: {
    fontWeight: 'bold',
    marginBottom: 16,
    fontSize: 18,
    color: '#0077aa'
  }
})

export default ChangePassword

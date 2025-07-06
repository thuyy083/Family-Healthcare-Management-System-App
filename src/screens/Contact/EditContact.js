import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { launchImageLibrary } from 'react-native-image-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getUserProfile, updateUserProfile } from '../../services/userService'
import { useNavigation } from '@react-navigation/native'
import { ToastAndroid } from 'react-native'
import { Appbar } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { updateUser } from '../../store/userSlice'

const EditContact = () => {
  const [profile, setProfile] = useState(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const navigation = useNavigation()

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserProfile()
      setProfile(data)
      if (data.hinhAnh) {
        setAvatar(`http://10.0.2.2:7060/images/khachhang/${data.hinhAnh}`)
      }
    }
    fetchData()
  }, [])

  const handleChooseImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 })

    if (result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri)
    }
  }

  const dispatch = useDispatch()
  const handleUpdate = async () => {
    const formData = new FormData()
    for (let key in profile) {
      if (key !== 'hinhAnh') formData.append(key, profile[key])
    }
    if (avatar && avatar.startsWith('file')) {
      formData.append('hinhAnhFile', {
        uri: avatar,
        type: 'image/jpeg',
        name: 'avatar.jpg'
      })
    }
    try {
      await updateUserProfile(formData)
      const updatedProfile = await getUserProfile()
      dispatch(updateUser(updatedProfile))
      navigation.goBack()
    } catch (e) {
      const message =
        e.response?.data ||
        e.response?.data?.message ||
        'Cập nhật thất bại!'
      ToastAndroid.show(message, ToastAndroid.LONG)
    }
  }

  if (!profile) return <Text>Loading...</Text>

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Chỉnh sửa thông tin" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>
      <KeyboardAwareScrollView
        style={styles.container}
        extraScrollHeight={25}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Chỉnh sửa thông tin</Text>

        <TouchableOpacity onPress={handleChooseImage}>
          <Image
            source={avatar ? { uri: avatar } : require('../../assets/images/Logo.png')}
            style={styles.avatar}
          />
          <Text style={styles.chooseText}>Chọn hình ảnh</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Họ tên"
          value={profile.hoTen}
          onChangeText={text => setProfile({ ...profile, hoTen: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={profile.diaChiEmail}
          onChangeText={text => setProfile({ ...profile, diaChiEmail: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Ngày sinh"
          value={profile.ngaySinh?.split('T')[0]}
          onFocus={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePicker
            mode="date"
            value={profile.ngaySinh ? new Date(profile.ngaySinh) : new Date()}
            maximumDate={new Date()}
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false)
              if (selectedDate) {
                const adjustedDate = new Date(selectedDate)
                adjustedDate.setDate(adjustedDate.getDate() + 1)

                //lưu dạng ISO (sau khi cộng ngày)
                const iso = adjustedDate.toISOString()
                setProfile({ ...profile, ngaySinh: iso })
              }
            }}

          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          value={profile.diaChi}
          onChangeText={text => setProfile({ ...profile, diaChi: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Người liên hệ khẩn cấp"
          value={profile.tenNguoiLienHeKhanCap}
          onChangeText={text => setProfile({ ...profile, tenNguoiLienHeKhanCap: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="SĐT khẩn cấp"
          value={profile.sdtNguoiLienHeKhanCap}
          onChangeText={text => setProfile({ ...profile, sdtNguoiLienHeKhanCap: text })}
        />

        <Button title="Lưu thay đổi" onPress={handleUpdate} />
      </KeyboardAwareScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f9ff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center'
  },
  chooseText: {
    textAlign: 'center',
    color: '#0077aa',
    marginBottom: 20
  }
})

export default EditContact

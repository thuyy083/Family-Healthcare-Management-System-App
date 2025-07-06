import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity
} from 'react-native'
import { Menu, Divider } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { Appbar, Button as PaperButton } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { bookService } from '../../services/bookSerService'
import { getStaff } from '../../services/bookSerService'
// import { ToastAndroid } from 'react-native'
import Toast from 'react-native-toast-message'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const BookServiceByIdScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { id } = route.params

    const [ngayBD, setNgayBD] = useState(new Date())
    const [showPicker, setShowPicker] = useState(false)
    const [soLuong, setSoLuong] = useState('1')
    const [sdt, setSdt] = useState('')
    const [diaChi, setDiaChi] = useState('')
    const [yeuCauNV, setYeuCauNV] = useState(0)
    const [tenNV, setTenNV] = useState('')
    const [moTaBenh, setMoTaBenh] = useState('')
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [staffList, setStaffList] = useState([])
    const [menuVisible, setMenuVisible] = useState(false)
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const data = await getStaff()
                setStaffList(data)
            } catch (err) {
                console.log('Lỗi tải danh sách nhân viên:', err)
            }
        }

        if (yeuCauNV === 1) fetchStaff()
    }, [yeuCauNV])


    const handleSubmit = async () => {
        if (!sdt.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Thiếu thông tin',
                text2: 'Vui lòng nhập số điện thoại'
            })
            return
        }

        if (!diaChi.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Thiếu thông tin',
                text2: 'Vui lòng nhập địa chỉ'
            })
            return
        }

        if (!moTaBenh.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Thiếu thông tin',
                text2: 'Vui lòng nhập mô tả bệnh'
            })
            return
        }

        if (!soLuong || parseInt(soLuong) <= 0) {
            Toast.show({
                type: 'error',
                text1: 'Sai số lượng',
                text2: 'Số lượng phải lớn hơn 0'
            })
            return
        }

        if (yeuCauNV === 1 && !tenNV.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Thiếu tên nhân viên',
                text2: 'Vui lòng nhập tên nhân viên'
            })
            return
        }

        try {
            const formData = {
                NgayBD: ngayBD.toISOString(),
                SoLuong: parseInt(soLuong),
                SDT: sdt,
                DiaChi: diaChi,
                YeuCauNV: yeuCauNV,
                TenNV: yeuCauNV === 1 ? tenNV : null,
                MoTaBenh: moTaBenh,
            }

            const res = await bookService(id, formData)

            Toast.show({
                type: 'success',
                text1: 'Đặt dịch vụ thành công',
                text2: res.message || '',
            })

            navigation.navigate('BookServiceDetail', { maDon: res.maLanSuDung })
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Không thể đặt dịch vụ'

            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: message,
            })
        }
    }



    return (
        <>
            <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
                <Appbar.Content title="Đặt dịch vụ" titleStyle={{ color: '#fff' }} />
            </Appbar.Header>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.container}
                extraScrollHeight={100}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.label}>Ngày bắt đầu</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                        <Text style={styles.dateText}>Ngày: {moment(ngayBD).format('DD/MM/YYYY')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.datePicker}>
                        <Text style={styles.dateText}>Giờ: {moment(ngayBD).format('HH:mm')}</Text>
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={ngayBD}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false)
                            if (event.type === 'set' && selectedDate) {
                                const newDate = new Date(ngayBD)
                                newDate.setFullYear(selectedDate.getFullYear())
                                newDate.setMonth(selectedDate.getMonth())
                                newDate.setDate(selectedDate.getDate())
                                setNgayBD(newDate)
                            }
                        }}
                    />
                )}

                {showTimePicker && (
                    <DateTimePicker
                        value={ngayBD}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedTime) => {
                            setShowTimePicker(false)
                            if (event.type === 'set' && selectedTime) {
                                const newDate = new Date(ngayBD)
                                newDate.setHours(selectedTime.getHours())
                                newDate.setMinutes(selectedTime.getMinutes())
                                setNgayBD(newDate)
                            }
                        }}
                    />
                )}

                <Text style={styles.label}>Số lượng</Text>
                <TextInput
                    style={styles.input}
                    value={soLuong}
                    keyboardType="numeric"
                    onChangeText={setSoLuong}
                />

                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                    style={styles.input}
                    value={sdt}
                    keyboardType="phone-pad"
                    onChangeText={setSdt}
                />

                <Text style={styles.label}>Địa chỉ</Text>
                <TextInput
                    style={styles.input}
                    value={diaChi}
                    onChangeText={setDiaChi}
                />

                <Text style={styles.label}>Yêu cầu nhân viên</Text>
                <View style={styles.radioGroup}>
                    <TouchableOpacity
                        style={[styles.radioButton, yeuCauNV === 0 && styles.radioSelected]}
                        onPress={() => setYeuCauNV(0)}
                    >
                        <Text style={yeuCauNV === 0 ? styles.radioTextSelected : styles.radioText}>Không</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.radioButton, yeuCauNV === 1 && styles.radioSelected]}
                        onPress={() => setYeuCauNV(1)}
                    >
                        <Text style={yeuCauNV === 1 ? styles.radioTextSelected : styles.radioText}>Có</Text>
                    </TouchableOpacity>
                </View>

                {yeuCauNV === 1 && (
                    <>
                        <Text style={styles.label}>Tên nhân viên</Text>
                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    onPress={() => setMenuVisible(true)}
                                    style={styles.input}
                                >
                                    <Text style={{ color: tenNV ? '#000' : '#aaa' }}>
                                        {tenNV || 'Chọn tên nhân viên'}
                                    </Text>
                                </TouchableOpacity>
                            }
                        >
                            {staffList.map((staff, index) => (
                                <Menu.Item
                                    key={index}
                                    onPress={() => {
                                        setTenNV(staff.tenNV)
                                        setMenuVisible(false)
                                    }}
                                    title={staff.tenNV}
                                />
                            ))}
                        </Menu>

                    </>
                )}

                <Text style={styles.label}>Mô tả bệnh</Text>
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    value={moTaBenh}
                    onChangeText={setMoTaBenh}
                    multiline
                />

                <PaperButton
                    mode="contained"
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    icon="check"
                >
                    Đặt dịch vụ
                </PaperButton>

            </KeyboardAwareScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f2f9ff',
        flexGrow: 1,
    },
    label: {
        marginTop: 12,
        marginBottom: 4,
        fontWeight: 'bold',
        color: '#0077aa',
    },
    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    datePicker: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    radioGroup: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    radioButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#eee',
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    radioSelected: {
        backgroundColor: '#0077aa',
    },
    radioText: {
        color: '#333',
        fontWeight: 'bold',
    },
    radioTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    submitButton: {
        marginTop: 24,
        backgroundColor: '#0077aa',
        borderRadius: 8,
    },
})

export default BookServiceByIdScreen

import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from 'react-native'
import { Appbar } from 'react-native-paper'
import moment from 'moment'
import { Divider } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Layout from '../../components/Layout'
import { getBookServiceById } from '../../services/bookSerService'

const statusInfo = (v) => {
    switch (v) {
        case 0: return { label: 'Chờ duyệt', color: '#B58900', icon: 'clock-outline' }
        case 1: return { label: 'Đã duyệt', color: '#2E7D32', icon: 'check-circle-outline' }
        case 2: return { label: 'Từ chối', color: '#C62828', icon: 'close-circle-outline' }
        case 3: return { label: 'Đã hủy', color: '#546E7A', icon: 'cancel' }
        default: return { label: 'Không rõ', color: '#546E7A', icon: 'alert-circle-outline' }
    }
}
const StarRating = ({ score = 0 }) => {
    const stars = Array.from({ length: 5 }).map((_, i) => (
        <Icon
            key={i}
            name={i < score ? 'star' : 'star-outline'}
            size={20}
            color="#FFD700"
            style={{ marginRight: 2 }}
        />
    ))
    return <View style={{ flexDirection: 'row', marginVertical: 4 }}>{stars}</View>
}

const BookServiceDetailScreen = ({ route, navigation }) => {
    const { maDon } = route.params

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getBookServiceById(maDon);
                setDetail(data);
            } catch (e) {
                console.log('Lỗi API:', e);
            } finally {
                setLoading(false);
            }
        })()
    }, [maDon])

    if (loading) {
        return (
            <Layout>
                <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
                    <Appbar.BackAction onPress={navigation.goBack} color="#fff" />
                    <Appbar.Content title="Chi tiết đơn đặt dịch vụ" titleStyle={{ color: '#fff' }} />
                </Appbar.Header>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#0077aa" />
                </View>
            </Layout>
        )
    }

    if (!detail) return null

    const s = statusInfo(detail.trangThai)

    return (
        <Layout>
            <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
                <Appbar.BackAction onPress={navigation.goBack} color="#fff" />
                <Appbar.Content title="Chi tiết dịch vụ" titleStyle={{ color: '#fff' }} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <View style={styles.headerBar} />
                    <Text style={styles.title}>{detail.tenDV}</Text>

                    <Row icon="calendar" label="Thời gian" value={moment(detail.ngayBD).format('DD/MM/YYYY')} />
                    <Row icon="counter" label="Số lượng" value={`${detail.soLuong} ${detail.dvt}`} />
                    <Row icon="currency-usd" label="Đơn giá" value={`${detail.tongTien.toLocaleString()} đ`} />

                    <Row
                        icon={s.icon}
                        label="Trạng thái"
                        value={
                            <View style={[styles.chip, { backgroundColor: `${s.color}22`, flexDirection: 'row', alignItems: 'center' }]}>
                                <Icon name={s.icon} size={14} color={s.color} style={{ marginRight: 4 }} />
                                <Text style={[styles.chipText, { color: s.color }]}>{s.label}</Text>
                            </View>
                        }
                    />

                    <Divider style={{ marginVertical: 8 }} />

                    <Row icon="phone" label="SĐT" value={detail.sdt} />
                    <Row icon="map" label="Địa chỉ" value={detail.diaChi} />
                    {detail.tenNV && <Row icon="account" label="Nhân viên" value={detail.tenNV} />}
                </View>

                {detail.maHD && (
                    <View style={styles.card}>
                        <Text style={styles.section}>Hóa đơn</Text>
                        <Row label="Mã HĐ" value={detail.maHD.toLocaleString()} />
                        <Row label="Ngày lập" value={moment(detail.ngayLapHD).format('DD/MM/YYYY HH:mm')} />
                        <Row label="NV phụ trách" value={detail.nhanVienPhanCong.toLocaleString()} />
                    </View>
                )}

                {detail.danhGia != null && (
                    <View style={styles.card}>
                        <Text style={styles.section}>Đánh giá của bạn</Text>

                        <Row
                            icon="star"
                            label="Đánh giá"
                            value={<StarRating score={detail.danhGia} />}
                        />

                        {detail.ndBinhLuan ? (
                            <>
                                <Divider style={{ marginVertical: 8 }} />
                                <Text style={styles.text}>{detail.ndBinhLuan}</Text>
                            </>
                        ) : null}
                    </View>
                )}
            </ScrollView>
        </Layout>
    )
}

const Row = ({ icon, label, value, valueStyle }) => (
    <View style={styles.row}>
        {icon && <Icon name={icon} size={18} color="#0077aa" style={{ marginRight: 4 }} />}
        <Text style={styles.label}>{label}</Text>
        {typeof value === 'string' ? (
            <Text style={[styles.value, valueStyle]}>{value}</Text>
        ) : (
            <View style={[styles.valueContainer]}>{value}</View>
        )}

    </View>
)

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { padding: 16, backgroundColor: '#F3F9FC' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    title: { fontSize: 18, fontWeight: '700', color: '#004d66', marginBottom: 8 },
    section: { fontSize: 16, fontWeight: '700', marginBottom: 6, color: '#0077aa' },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 2,
    },
    label: {
        width: 90,
        fontWeight: '600',
        color: '#333',
    },
    value: {
        flex: 1,
        color: '#333',
        flexWrap: 'wrap',
    },
    text: { color: '#333', lineHeight: 20 },
    chip: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    chipText: { fontSize: 13, fontWeight: '600' },
    valueContainer: {
        flex: 1,
        paddingVertical: 2,
        justifyContent: 'center'
    },


})

export default BookServiceDetailScreen

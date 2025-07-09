import React, { useState, useEffect } from 'react'
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, FlatList, Keyboard, Platform,
    KeyboardAvoidingView, TouchableWithoutFeedback,
} from 'react-native'
import { Appbar, ActivityIndicator } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { askChatBot } from '../../services/chatbotService'

const ChatBotScreen = () => {
    const navigation = useNavigation()
    const [input, setInput] = useState('')
    const [messages, setMsg] = useState([])
    const [loading, setLoad] = useState(false)

    const push = (from, text) => setMsg(p => [...p, { from, text }])
useEffect(() => {
    push('bot', 'Xin chào, tôi có thể giúp gì cho bạn?')
  }, [])

    const handleSend = async () => {
        if (!input.trim()) return

        push('user', input)
        setInput('')

        try {
            setLoad(true)
            const answer = await askChatBot(input)
            push('bot', answer)
        } catch (err) {
            console.log('askChatBot error >>>', err?.response?.data ?? err.message)
            const msg =
                err?.response?.data?.message ??
                err?.response?.data?.error ??
                err.message
            push('bot', `Xin lỗi, lỗi: ${msg}`)
        } finally {
            setLoad(false)
        }
    }


    const renderItem = ({ item }) => (
        <View style={[
            styles.bubble,
            item.from === 'user' ? styles.user : styles.bot]}>
            <Text style={styles.text}>{item.text}</Text>
        </View>
    )

    return (
        <>
            <Appbar.Header style={{ backgroundColor: '#0077aa' }}>
                <Appbar.BackAction onPress={navigation.goBack} color="#fff" />
                <Appbar.Content title="Trợ giúp" color="#fff" />
            </Appbar.Header>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                        data={messages}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ padding: 12, flexGrow: 1 }}
                    />
                </TouchableWithoutFeedback>

                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập câu hỏi..."
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={[styles.btn, loading && { opacity: 0.5 }]}
                        onPress={handleSend}
                        disabled={loading}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Gửi</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>
    )
}

const styles = StyleSheet.create({
    bubble: { padding: 10, borderRadius: 10, marginBottom: 8, maxWidth: '80%' },
    user: { alignSelf: 'flex-end', backgroundColor: '#0077aa' },
    bot: { alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
    text: { color: '#000', lineHeight: 20, textAlign: 'left' },
    inputBar: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, marginRight: 8 },
    btn: { backgroundColor: '#0077aa', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
})

export default ChatBotScreen

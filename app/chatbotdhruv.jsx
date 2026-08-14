import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { getGeminiResponse } from "../src/assets/API/gemini";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ChatScreen = () => {
    const [messages, setMessages] = useState([
        { 
            id: '1', 
            text: "Hi there! I noticed you've been working hard on your Database system assignments for over an hour. How are you feeling about the **chain rule**?", 
            sender: 'ai', 
            time: '10:15 AM' 
        },
        {
            id: 'boost-1',
            type: 'boost',
            text: "You seem a bit stressed. Should we take a 2-minute **'Micro-Break'** or try a quick visualization?",
            sender: 'ai'
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);

    const sendMessage = async (text) => {
        const messageContent = text || inputText;
        if (messageContent.trim() === '') return;

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        
        const userMsg = { 
            id: Date.now().toString(), 
            text: messageContent, 
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages((prev) => [userMsg, ...prev]);
        setInputText('');
        setIsAiTyping(true);

        try {
            const aiText = await getGeminiResponse(messageContent);
            setIsAiTyping(false);
            
            const aiMsg = {
                id: (Date.now() + 1).toString(),
                text: aiText,
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [aiMsg, ...prev]);
        } catch (error) {
            setIsAiTyping(false);
            console.error("Chat Error:", error);
        }
    };

    const renderItem = ({ item }) => {
        if (item.type === 'boost') {
            return (
                <View style={styles.boostCard}>
                    <View style={styles.boostHeader}>
                        <Text style={styles.boostIcon}>🧠</Text>
                        <Text style={styles.boostTitle}>ENGAGEMENT BOOST ACTIVE</Text>
                    </View>
                    <Markdown style={markdownStyles(true)}>{item.text}</Markdown>
                </View>
            );
        }

        const isAi = item.sender === 'ai';
        return (
            <View style={[styles.messageRow, isAi ? styles.aiRow : styles.userRow]}>
                {isAi && (
                    <View style={styles.aiAvatar}>
                        <Text style={styles.avatarText}>D</Text>
                    </View>
                )}
                
                <View style={{ flex: 1, alignItems: isAi ? 'flex-start' : 'flex-end' }}>
                    <View style={[styles.bubble, isAi ? styles.aiBubble : styles.userBubble]}>
                        <Markdown style={markdownStyles(isAi)}>
                            {item.text}
                        </Markdown>
                    </View>
                    {item.time && <Text style={styles.timestamp}>{item.time}</Text>}
                </View>

                {!isAi && (
                    <View style={styles.userAvatar}>
                        <Text style={{fontSize: 20}}>👤</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerProfile}>
                        <TouchableOpacity 
                            onPress={() => router.push('/coursedetails')} 
                            style={styles.backButton}
                        >
                            <Ionicons name="chevron-back" size={30} color="white" />
                        </TouchableOpacity>
                        <View style={styles.mainAvatar}>
                            <Text style={{fontSize: 24}}>👨‍🎓</Text>
                            <View style={styles.onlineBadge} />
                        </View>
                        <View style={{marginLeft: 12}}>
                            <Text style={styles.headerName}>Dhruv <Text style={styles.headerId}>ILIS</Text></Text>
                            <Text style={styles.headerStatus}>● Online & Ready to help</Text>
                        </View>
                    </View>
                    <View style={styles.headerIcons}>
                        <Text style={styles.iconText}>🔍</Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    inverted
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={() => isAiTyping && (
                        <Text style={styles.typingIndicator}>Dhruv is typing...</Text>
                    )}
                />

                <View style={styles.inputArea}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message....."
                            placeholderTextColor="#999"
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={() => sendMessage()}
                        />
                        
                        {inputText.trim().length > 0 && (
                            <TouchableOpacity 
                                style={styles.rocketButton} 
                                onPress={() => sendMessage()}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.rocketIcon}>🚀</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

// --- MARKDOWN STYLING HELPER ---
const markdownStyles = (isAi) => ({
    body: {
        color: isAi ? '#333' : 'white',
        fontSize: 15,
        lineHeight: 22,
    },
    strong: {
        fontWeight: 'bold',
        color: isAi ? '#000' : '#FFF',
    },
    bullet_list: {
        marginTop: 5,
    },
    bullet_list_icon: {
        color: isAi ? '#5D47E0' : 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFDF0' },
    header: { 
        height: 140, 
        backgroundColor: '#5D47E0', 
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingTop: 50,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerProfile: { flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 10 },
    mainAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' },
    onlineBadge: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#4ade80', position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: '#5D47E0' },
    headerName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    headerId: { color: '#A594FF' },
    headerStatus: { color: '#D1C9FF', fontSize: 12, marginTop: 2 },
    headerIcons: { flexDirection: 'row' },
    iconText: { color: 'white', fontSize: 20 },

    listContent: { paddingHorizontal: 15, paddingVertical: 20 },
    messageRow: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-start' },
    aiRow: { paddingRight: 40 },
    userRow: { paddingLeft: 40 },
    
    aiAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#7C69EF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ADC4FF', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
    avatarText: { color: 'white', fontWeight: 'bold' },

    bubble: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2 },
    aiBubble: { backgroundColor: 'white', borderTopLeftRadius: 2 },
    userBubble: { backgroundColor: '#635BFF', borderTopRightRadius: 2 },
    
    timestamp: { fontSize: 10, color: '#AAA', marginTop: 4 },

    boostCard: { backgroundColor: '#EEF0FF', borderRadius: 15, padding: 15, marginBottom: 20, borderWidth: 1, borderColor: '#D0D7FF' },
    boostHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    boostIcon: { fontSize: 16, marginRight: 8 },
    boostTitle: { color: '#5D47E0', fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },

    inputArea: { paddingHorizontal: 15, paddingBottom: Platform.OS === 'ios' ? 30 : 15, backgroundColor: 'transparent' },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EBEBEB', borderRadius: 30, paddingRight: 6 },
    input: { flex: 1, paddingHorizontal: 20, paddingVertical: 12, fontSize: 16, color: '#333', minHeight: 48 },
    rocketButton: { backgroundColor: '#5D47E0', width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
    rocketIcon: { fontSize: 18 },
    typingIndicator: { padding: 10, color: '#999', fontStyle: 'italic', fontSize: 13 }
});

export default ChatScreen;
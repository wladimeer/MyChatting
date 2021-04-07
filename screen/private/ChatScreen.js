import { View, StatusBar, StyleSheet, KeyboardAvoidingView, ImageBackground, TextInput, Text } from 'react-native';
import { firedata, createMessage } from '../../service/Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';

const ChatScreen = function ({ route, navigation }) {
  const { selected, chatGroup } = route.params;
  const [message, setMessage] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState({});
  let scrollView = useRef(null);

  useEffect(() => {
    let mounted = true;

    firedata()
      .ref('Users')
      .on('value', (response) => {
        response.forEach((user) => {
          if (mounted) {
            if (user.val().uid == selected) {
              setUser(user.val());
            }
          }
        });
      });

    firedata()
      .ref('Messages')
      .on('value', (response) => {
        response.forEach((groups) => {
          if (groups.key == chatGroup) {
            let messages = [];

            groups.forEach((message) => {
              messages.push(message.val());
            });

            if (mounted) {
              setMessage(messages);
            }
          }
        });
      });

    return () => (mounted = false);
  }, []);

  onScrollEnd();

  let background =
    'https://as.com/meristation/imagenes/2019/11/11/betech/1573497171_487815_1573497337_sumario_grande.jpg';

  function onBackHome() {
    navigation.navigate('HomeScreen');
  }

  function onScrollEnd() {
    setTimeout(() => {
      scrollView.current.scrollToEnd({ animated: true });
    }, 100);
  }

  function onSendMessage() {
    if (text != '') {
      createMessage(chatGroup, {
        user: user.uid,
        message: text
      }).then((response) => {
        setText('');
      });
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#000000" />

      <View style={styles.header}>
        <Ionicons name="arrow-back" size={25} color="#FFFFFF" onPress={onBackHome} />
        <Text style={{ color: '#ffffff', fontSize: 16 }}>{user && user.name}</Text>
      </View>

      <ImageBackground source={{ uri: background }} style={styles.content}>
        <ScrollView ref={scrollView}>
          <View style={{ marginVertical: 5 }}>
            {message &&
              message.map((chat) => {
                if (chat.user != user.uid) {
                  return (
                    <View
                      key={chat.time}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start'
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: '#CA6F1E',
                          borderTopRightRadius: 8,
                          borderBottomLeftRadius: 8,
                          borderBottomRightRadius: 8,
                          marginVertical: 5,
                          marginLeft: 5,
                          padding: 6
                        }}
                      >
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 15
                          }}
                        >
                          {chat.message}
                        </Text>
                        <Text
                          style={{
                            textAlign: 'left',
                            color: '#2C2F2F',
                            fontSize: 10
                          }}
                        >
                          {chat.hour}
                        </Text>
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <View
                      key={chat.time}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: '#138D75',
                          borderBottomLeftRadius: 8,
                          borderBottomRightRadius: 8,
                          borderTopLeftRadius: 8,
                          marginVertical: 5,
                          marginRight: 5,
                          padding: 6
                        }}
                      >
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 15
                          }}
                        >
                          {chat.message}
                        </Text>
                        <Text
                          style={{
                            textAlign: 'right',
                            color: '#2C2F2F',
                            fontSize: 10
                          }}
                        >
                          {chat.hour}
                        </Text>
                      </View>
                    </View>
                  );
                }
              })}
          </View>
        </ScrollView>

        <View style={styles.writing}>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe un mensaje"
            onChangeText={(value) => setText(value)}
            onFocus={onScrollEnd}
            value={text}
          />
          <Ionicons onPress={onSendMessage} size={25} name="md-send" color="black" />
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1C2833',
    paddingHorizontal: 12,
    paddingVertical: 25,
    height: 'auto'
  },
  content: {
    flex: 1,
    resizeMode: 'cover'
  },
  writing: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8
  },
  textInput: {
    width: '90%',
    color: '#515A5A',
    borderRadius: 22,
    fontSize: 16,
    height: 50
  }
});

export default ChatScreen;

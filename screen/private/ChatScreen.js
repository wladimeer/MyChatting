import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, StatusBar, View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Feather, Ionicons } from '@expo/vector-icons';
import { searchUser } from '../../service/Firebase';
import React, { useEffect, useState } from 'react';

const ChatScreen = function ({ route, navigation }) {
  const [user, setUser] = useState();
  const { selected } = route.params;

  useEffect(() => {
    searchUser(selected).then((response) => {
      setUser(response);
    });
  }, []);

  function backHome() {
    navigation.navigate('HomeScreen');
  }

  return (
    <View>
      <StatusBar backgroundColor="#000000" />

      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" onPress={backHome} />
        <Text style={{ color: '#ffffff', fontSize: 16 }}>{user && user.name}</Text>
      </View>

      <ScrollView>
        <View></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C2833',
    paddingHorizontal: 12,
    paddingVertical: 25
  }
});

export default ChatScreen;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, ListItem, Avatar } from 'react-native-elements';
import { StyleSheet, StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { readUsers } from '../../service/Firebase';
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';

const HomeScreen = function ({ navigation }) {
  const [users, setUsers] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    AsyncStorage.getItem('user').then((response) => {
      setName(JSON.parse(response).name);
    });

    readUsers().then((response) => {
      setUsers(response);
    });
  }, []);

  function userSelected(selected) {
    navigation.navigate('ChatScreen', { selected: selected });
  }

  return (
    <View>
      <StatusBar backgroundColor="#000000" />

      <View style={styles.header}>
        <Text style={{ color: '#ffffff', fontSize: 16 }}>Hola {name}!</Text>
        <Feather name="more-vertical" size={24} color="#FFFFFF" />
      </View>

      <ScrollView>
        <View style={styles.information}>
          {users &&
            users.map((user) => (
              <ListItem
                key={user.uid}
                onPress={() => {
                  userSelected(user.email);
                }}
              >
                <Avatar
                  rounded
                  source={{
                    uri:
                      'https://librenoticias.com/wp-content/uploads/2020/08/default-user-image.png'
                  }}
                />
                <ListItem.Content>
                  <ListItem.Title>{user.name}</ListItem.Title>
                  <ListItem.Subtitle>Estado</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
        </View>
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
  },
  information: {
    borderColor: '#E7E7E7',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderTopWidth: 1
  }
});

export default HomeScreen;

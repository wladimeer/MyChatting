import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, ListItem, Avatar } from 'react-native-elements';
import { firedata, searchGroup } from '../../service/Firebase';
import { StyleSheet, StatusBar, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';

const HomeScreen = function ({ navigation }) {
  const [userData, setUserData] = useState({});
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('user').then((response) => {
      setUserData(JSON.parse(response));
    });

    firedata()
      .ref('Users')
      .on('value', (response) => {
        let users = [];

        response.forEach((user) => {
          users.push({
            uid: user.val().uid,
            lastnames: user.val().lastnames,
            register: user.val().registerDate,
            email: user.val().email,
            name: user.val().name
          });
        });

        setUserList(users);
      });
  }, []);

  function onSelected(selected) {
    searchGroup([
      userData.uid.substring(0, 8) + selected.substring(0, 8),
      selected.substring(0, 8) + userData.uid.substring(0, 8)
    ]).then((response) => {
      navigation.navigate('ChatScreen', {
        selected: selected,
        chatGroup: response
      });
    });
  }

  return (
    <View>
      <StatusBar backgroundColor="#000000" />

      <View style={styles.header}>
        <Text style={{ color: '#ffffff', fontSize: 16 }}>Hola {userData.name}!</Text>
        <Feather name="more-vertical" size={24} color="#FFFFFF" />
      </View>

      <ScrollView>
        <View style={styles.information}>
          {userList &&
            userList.map((user) => {
              if (user.uid != userData.uid) {
                return (
                  <ListItem
                    key={user.uid}
                    onPress={() => {
                      onSelected(user.uid);
                    }}
                  >
                    <Avatar
                      rounded
                      source={{
                        uri: 'https://librenoticias.com/wp-content/uploads/2020/08/default-user-image.png'
                      }}
                    />
                    <ListItem.Content>
                      <ListItem.Title>{user.name}</ListItem.Title>
                      <ListItem.Subtitle>Estado</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                );
              }
            })}
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

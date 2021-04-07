import { StyleSheet, Alert, StatusBar, View } from 'react-native';
import { Card, Button, Text, Input } from 'react-native-elements';
import { createUser } from '../../service/Firebase';
import React, { useState } from 'react';

const SignUp = function ({ navigation }) {
  const [state, setState] = useState({
    name: '',
    password: '',
    lastname: '',
    email: ''
  });

  function changeText(name, value) {
    setState({ ...state, [name]: value });
  }

  function onRegister() {
    if (
      !state.name.trim() ||
      !state.lastname.trim() ||
      !state.email.trim() ||
      !state.password.trim()
    ) {
      Alert.alert('Atención', 'Verifica los Campos', [{ text: 'ENTENDIDO' }]);
      return;
    }

    createUser({
      name: state.name,
      password: state.password,
      lastname: state.lastname,
      email: state.email
    })
      .then((response) => {
        navigation.navigate('SlideScreens');
      })
      .catch((response) => {
        Alert.alert('Atención', String(response), [{ text: 'ENTENDIDO' }]);
        return;
      });
  }

  function onNavigate() {
    navigation.navigate('SignInScreen');
    // Linking.openURL("whatsapp://send?text=hola&phone=56967542397");
  }

  return (
    <Card>
      <StatusBar backgroundColor="#000000" />

      <View>
        <Text style={styles.title}>Iniciar Sesión</Text>
      </View>

      <Card.Divider style={styles.divider}></Card.Divider>

      <View>
        <Text>Nombre</Text>
        <Input
          onChangeText={(value) => changeText('name', value)}
          style={{ paddingVertical: 10 }}
        />
      </View>

      <View>
        <Text>Apellido</Text>
        <Input
          onChangeText={(value) => changeText('lastname', value)}
          style={{ paddingVertical: 10 }}
        />
      </View>

      <View>
        <Text>Correo Electrónico</Text>
        <Input
          onChangeText={(value) => changeText('email', value)}
          style={{ paddingVertical: 10 }}
        />
      </View>

      <View>
        <Text>Contraseña</Text>
        <Input
          onChangeText={(value) => changeText('password', value)}
          style={{ paddingVertical: 10 }}
          secureTextEntry={true}
        />
      </View>

      <View>
        <Button onPress={onRegister} title="CREAR CUENTA" />
      </View>

      <View>
        <Text onPress={onNavigate} style={styles.navigate}>
          ¿Ya tienes una cuenta? Iniciar Sesión
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18
  },
  divider: {
    marginVertical: 18
  },
  navigate: {
    textAlign: 'center',
    marginTop: 20
  }
});

export default SignUp;

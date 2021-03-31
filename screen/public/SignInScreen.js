import { StyleSheet, Alert, StatusBar, View } from 'react-native';
import { Card, Button, Text, Input } from 'react-native-elements';
import { loginUser } from '../../service/Firebase';
import React, { useState } from 'react';

const SignInScreen = function ({ navigation }) {
  const [state, setState] = useState({ email: '', password: '' });

  function changeText(name, value) {
    setState({ ...state, [name]: value });
  }

  function onLogin() {
    if (!state.email.trim() && !state.password.trim()) {
      Alert.alert('Atención', 'Verifica los Campos', [{ text: 'ENTENDIDO' }]);
      return;
    }

    loginUser({ email: state.email, password: state.password })
      .then((response) => {
        navigation.navigate('SlideScreens');
      })
      .catch((response) => {
        Alert.alert('Atención', String(response), [{ text: 'ENTENDIDO' }]);
        return;
      });
  }

  function onNavigate() {
    navigation.navigate('SignUpScreen');
  }

  return (
    <Card>
      <StatusBar backgroundColor="#000000" />

      <View>
        <Text style={styles.title}>Iniciar Sesión</Text>
      </View>

      <Card.Divider style={styles.divider}></Card.Divider>

      <View>
        <Text>Correo Electrónico</Text>
        <Input
          onChangeText={(value) => changeText('email', value)}
          style={{ paddingVertical: 10 }}
        />
      </View>

      <View>
        <Text>Contraseña Usuario</Text>
        <Input
          onChangeText={(value) => changeText('password', value)}
          style={{ paddingVertical: 10 }}
        />
      </View>

      <View>
        <Button onPress={onLogin} title="INICIAR SESIÓN" />
      </View>

      <View>
        <Text onPress={onNavigate} style={styles.navigate}>
          ¿No tienes una cuenta? Crear Cuenta
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

export default SignInScreen;

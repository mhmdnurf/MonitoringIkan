import {View, Text, Dimensions, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import Logo from './splash.svg';

interface SplashScreen {
  navigation: any;
}

const SplashScreen = ({navigation}: SplashScreen) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#BEADFA" />
      <View style={styles.container}>
        <Logo width={300} height={300} />
        <Text style={styles.title}>Monitoring Air Aquarium</Text>
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('screen').height,
    backgroundColor: '#BEADFA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
  },
});

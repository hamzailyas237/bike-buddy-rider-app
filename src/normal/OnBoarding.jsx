import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import CStyles from '../style';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {API_BASE_URL} from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const OnBoarding = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({
    riderEmail: '',
    numberPlate: '',
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('plate-no');
        if (value) {
          navigation.navigate('Home');
        }
      } catch (e) {
        // error reading value
      }
    };
    getData();
  }, []);

  const handleDataChange = (key, value) => {
    if (key == "numberPlate") {
      setData({
        ...data,
        [key]: value.toUpperCase(),
      });
    } else {
      setData({
        ...data,
        [key]: value,
      });
    }
  };

  console.log(data);
  const saveData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/${data?.numberPlate}`,
      );
      console.log('response', response?.data?.user);
      await AsyncStorage.setItem('plate-no', response?.data?.user?.numberPlate);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View
        style={[
          CStyles.alignItemsCenter,
          CStyles.AppBg1,
          CStyles.py5,
          {flex: 1},
        ]}>
        <Text
          style={[
            {fontSize: 50},
            CStyles.textBold,
            CStyles.textWhite,
            CStyles.mb2,
          ]}>
          Bike Buddy
        </Text>
        <Text
          style={[
            CStyles.fs2,
            CStyles.textBold,
            CStyles.textDanger,
            CStyles.mb3,
          ]}>
          Safety in Every Spin
        </Text>

        <TextInput
          label="Rider Email"
          value={data.riderEmail}
          mode="outlined"
          onChangeText={text => handleDataChange('riderEmail', text)}
          style={[{width: '80%'}, CStyles.mb1]}
          theme={{dark: false}}
          placeholder="Enter your rider email"
          keyboardType="email-address"
        />
        <TextInput
          label="Number Plate"
          value={data.numberPlate}
          mode="outlined"
          onChangeText={text => handleDataChange('numberPlate', text)}
          style={[{width: '80%'}, CStyles.mb1]}
          theme={{dark: false}}
          placeholder="Enter your number plate"
          keyboardType="name-phone-pad"
        />

        <TouchableOpacity
          onPress={saveData}
          style={[styles.saveButton, {backgroundColor: '#fc2f00'}]}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  saveButton: {
    width: screenWidth * 0.8,
    alignSelf: 'center',
    marginVertical: 10,
    paddingVertical: 15,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default OnBoarding;

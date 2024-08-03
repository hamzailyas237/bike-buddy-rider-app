import React, {useEffect, useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../utils';
import CStyles from '../style';
import AppLoader from '../Components/Loader';

const Home = ({navigation}) => {
  const mapRef = useRef(null); // Ref for accessing MapView methods
  const [mlat, setMLat] = useState(null);
  const [mlong, setMLong] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('plate-no');
        if (!value) {
          navigation.navigate('OnBoarding');
        }
      } catch (e) {
        console.error('Error reading value:', e);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const value = await AsyncStorage.getItem('plate-no');
        const response = await axios.get(`${API_BASE_URL}/user/${value}`);
        setMLat(parseFloat(response?.data?.user.latitude));
        setMLong(parseFloat(response?.data?.user.longitude));
        // Animate to the user's location with a default zoom level
        mapRef.current.animateToRegion({
          latitude: parseFloat(response?.data?.user.latitude),
          longitude: parseFloat(response?.data?.user.longitude),
          latitudeDelta: 0.01, // Adjust these values for desired zoom level
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUserData();
  }, []);

  return (
    <>
      {!mlat || !mlong ? (
        <AppLoader />
      ) : (
        <View style={[CStyles.positionRelative, {flex: 1}]}>
          {/* <View
            style={[
              CStyles.positionAbsolute,
              CStyles.justifyContentCenter,
              CStyles.w100,
              CStyles.p1,
              CStyles.h30,
              CStyles.rounded,
              CStyles.bgWhite,
              {zIndex: 1, bottom: 0},
            ]}>
            <View
              style={[
                CStyles.flexRow,
                CStyles.justifyContentAround,
                CStyles.my1,
              ]}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Outofrange')}
                style={[
                  CStyles.flexRow,
                  CStyles.w45,
                  CStyles.AppBg1,
                  CStyles.p2,
                  CStyles.rounded,
                  CStyles.alignItemsCenter,
                ]}>
                <Icon name="location-on" size={30} color={CStyles._white} />
                <View style={[CStyles.mx1]}>
                  <Text style={[CStyles.fs6, CStyles.textWhite]}>Distance</Text>
                  <Text
                    style={[CStyles.fs5, CStyles.textWhite, CStyles.textBold]}>
                    78m
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Outofrange')}
                style={[
                  CStyles.flexRow,
                  CStyles.w45,
                  CStyles.AppBg1,
                  CStyles.p2,
                  CStyles.rounded,
                  CStyles.alignItemsCenter,
                ]}>
                <Icon name="speed" size={30} color={CStyles._white} />
                <View style={[CStyles.mx1]}>
                  <Text style={[CStyles.fs6, CStyles.textWhite]}>
                    Max Speed
                  </Text>
                  <Text
                    style={[CStyles.fs5, CStyles.textWhite, CStyles.textBold]}>
                    50km/h
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[CStyles.flexRow, CStyles.justifyContentAround]}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Outofrange')}
                style={[
                  CStyles.flexRow,
                  CStyles.w45,
                  CStyles.AppBg1,
                  CStyles.p2,
                  CStyles.rounded,
                  CStyles.alignItemsCenter,
                ]}>
                <Icon name="schedule" size={30} color={CStyles._white} />
                <View style={[CStyles.mx1]}>
                  <Text style={[CStyles.fs6, CStyles.textWhite]}>Time</Text>
                  <Text
                    style={[CStyles.fs5, CStyles.textWhite, CStyles.textBold]}>
                    1h 26min
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('Outofrange')}
                style={[
                  CStyles.flexRow,
                  CStyles.w45,
                  CStyles.AppBg1,
                  CStyles.p2,
                  CStyles.rounded,
                  CStyles.alignItemsCenter,
                ]}>
                <Icon name="speed" size={30} color={CStyles._white} />
                <View style={[CStyles.mx1]}>
                  <Text style={[CStyles.fs6, CStyles.textWhite]}>
                    Avg Speed
                  </Text>
                  <Text
                    style={[CStyles.fs5, CStyles.textWhite, CStyles.textBold]}>
                    43km/h
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View> */}
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: mlat,
              longitude: mlong,
              latitudeDelta: 0.01, // Initial delta values, will be overridden by animateToRegion
              longitudeDelta: 0.01,
            }}>
            <Marker
              coordinate={{
                latitude: mlat,
                longitude: mlong,
              }}
              title={'HOME'}
            />
          </MapView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Home;

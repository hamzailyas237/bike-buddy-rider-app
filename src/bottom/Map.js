import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_BASE_URL} from '../utils';
import {haversineDistance} from '../utils/CalculateDistance';
import AppLoader from '../Components/Loader';

const Map = ({navigation}) => {
  const [riderLocation, setRiderLocation] = useState({
    // latitude: 25.1929837,
    // longitude: 66.4959539,
    latitude: null,
    longitude: null,
  });

  const [homeLocation, setHomeLocation] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('plate-no');
        const response = await axios.get(`${API_BASE_URL}/user/${value}`);
        setHomeLocation({
          latitude: parseFloat(response?.data?.user.latitude),
          longitude: parseFloat(response?.data?.user.longitude),
        });
        setRiderLocation({
          latitude: parseFloat(response?.data?.user.riderLatitude),
          longitude: parseFloat(response?.data?.user.riderLongitude),
        });
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const trackLiveLocation = async () => {
      const value = await AsyncStorage.getItem('plate-no');

      Geolocation.watchPosition(
        position => {
          const obj = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          const distance = haversineDistance(homeLocation, obj);
          console.log('trackLiveLocation distance', distance.toFixed());

          setRiderLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log('trackLiveLocation:', position);
          axios
            .patch(`${API_BASE_URL}/user`, {
              riderLatitude: position.coords.latitude,
              riderLongitude: position.coords.longitude,
              lastSpeed: position.coords.speed,
              lastDistance: distance.toFixed(),
              numberPlate: value,
            })
            .then(response => {
              console.log('Tracking Location', response.data);
            })
            .catch(error => {
              console.error('Error updating location', error);
            });
        },
        error => console.log(error.message),
        {
          enableHighAccuracy: true,
          distanceFilter: 10, // meters
          interval: 5000, // milliseconds
          fastestInterval: 10000, // milliseconds
        },
      );
    };
    trackLiveLocation();
    return () => {
      Geolocation.clearWatch();
    };
  }, []);

  useEffect(() => {
    const getCurrentLocation = async () => {
      const value = await AsyncStorage.getItem('plate-no');

      Geolocation.getCurrentPosition(position => {
        const obj = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const distance = haversineDistance(homeLocation, obj);
        console.log('getCurrentLocation distance', distance.toFixed());
        setRiderLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        axios
          .patch(`${API_BASE_URL}/user`, {
            riderLatitude: position.coords.latitude,
            riderLongitude: position.coords.longitude,
            lastSpeed: position.coords.speed,
            lastDistance: distance.toFixed(),
            numberPlate: value,
          })
          .then(response => {
            console.log('Location updated successfully', response.data);
          })
          .catch(error => {
            console.error('Error updating location', error);
          });
      });
    };
    getCurrentLocation();
  }, []);

  return (
    <>
      {!homeLocation?.latitude ||
      !homeLocation?.longitude ||
      !riderLocation?.latitude ||
      !riderLocation?.longitude ? (
        <AppLoader />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('Outofrange')}
            style={[
              styles.positionAbsolute,
              styles.flexRow,
              styles.w90,
              styles.AppBg1,
              styles.p2,
              styles.rounded,
              styles.alignItemsCenter,
              {top: 60, zIndex: 1},
            ]}>
            <Icon name="location-on" size={30} color="#fff" />
            <View style={[styles.mx1]}>
              <Text style={[styles.fs5, styles.textWhite]}>70m</Text>
              <Text style={[styles.fs5, styles.textWhite, styles.textBold]}>
                North Nazimabad, block 02
              </Text>
            </View>
          </TouchableOpacity> */}
          <MapView
            style={styles.map}
            region={{
              latitude: riderLocation.latitude,
              longitude: riderLocation.longitude,
              latitudeDelta: 0.092,
              longitudeDelta: 0.121,
            }}>
            <Marker
              coordinate={{
                latitude: riderLocation.latitude,
                longitude: riderLocation.longitude,
              }}>
              <Icon name="two-wheeler" size={40} color="black" />
            </Marker>

            <Marker
              coordinate={{
                latitude: homeLocation.latitude,
                longitude: homeLocation.longitude,
              }}>
              <Icon name="home" size={40} color="black" />
            </Marker>
            <Polyline
              coordinates={[homeLocation, riderLocation]}
              strokeWidth={6}
              strokeColor="blue"
            />
          </MapView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  positionAbsolute: {
    position: 'absolute',
  },
  flexRow: {
    flexDirection: 'row',
  },
  w90: {
    width: '90%',
  },
  AppBg1: {
    backgroundColor: '#000',
  },
  p2: {
    padding: 8,
  },
  rounded: {
    borderRadius: 8,
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  mx1: {
    marginHorizontal: 8,
  },
  fs5: {
    fontSize: 16,
  },
  textWhite: {
    color: '#fff',
  },
  textBold: {
    fontWeight: 'bold',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;

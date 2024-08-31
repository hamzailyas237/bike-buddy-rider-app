import { ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import CStyles from '../style'
import splashBg from '../../assets/splash-bg.png';

const Splash = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Parent')
        }, 2000)
    }, [])
    return (
        <ImageBackground
      style={[
        CStyles.alignItemsCenter,
        CStyles.justifyContentCenter,
        {flex: 1},
      ]}
      source={splashBg}></ImageBackground>
    )
}

export default Splash
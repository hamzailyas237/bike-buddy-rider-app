package com.smartvehicle

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainActivity : ReactActivity() {

  // Track if the intent is new
  private var isOnNewIntent = false

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "SmartVehicle"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flag [fabricEnabled].
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    isOnNewIntent = true
    foregroundEmitter()
  }

  override fun onStart() {
    super.onStart()
    if (!isOnNewIntent) {
        foregroundEmitter()
    }
  }

  private fun foregroundEmitter() {
    // Method to send data from Java to JavaScript
    val main = intent.getStringExtra("mainOnPress")
    val button = intent.getStringExtra("buttonOnPress")
    val map: WritableMap = Arguments.createMap()
    
    main?.let { map.putString("main", it) }
    button?.let { map.putString("button", it) }
    
    try {
      reactInstanceManager.currentReactContext?.let { reactContext ->
        reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("notificationClickHandle", map)
      }
    } catch (e: Exception) {
      Log.e("SuperLog", "Caught Exception: ${e.message}")
    }
  }
}

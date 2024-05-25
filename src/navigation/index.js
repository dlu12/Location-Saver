import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import MapScreen from "../screen/MapScreen";
import LocationsScreen from "../screen/LocationScreen";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const [savedLocations, setSavedLocations] = useState([]);
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Map">
          {(props) => (
            <MapScreen
              {...props}
              savedLocations={savedLocations}
              setSavedLocations={setSavedLocations}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Locations">
          {(props) => (
            <LocationsScreen {...props} savedLocations={savedLocations} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainTabNavigator;

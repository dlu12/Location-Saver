import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MapScreen from "../screen/MapScreen";
import LocationsScreen from "../screen/LocationScreen";
import { Entypo } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const [savedLocations, setSavedLocations] = useState([]);

  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Map") {
            iconName = focused ? "map" : "map";
          } else if (route.name === "Locations") {
            iconName = focused ? "list" : "list";
          }

          return <Entypo name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
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
  );
};

export default MainTabNavigator;

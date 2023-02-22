import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Colors, globalStyles } from '../styles'
import { cardCategoriesList } from './searchInCategoriesList'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

export default function EntityCard({ item }) {
  const navigation = useNavigation()
  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        onPress={() => navigation.navigate("InspectorEntityDetailsScreen", {
          entityId: item.id
        })}>
        <View style={styles.heading_wrapper}>
          <Text style={styles.restaurentName}
            numberOfLines={1}
          >{item?.establishment_name}</Text>
        </View>
        <View style={styles.body_wrapper}>
          {
            cardCategoriesList.map((innerItem, index) => (
              <Text key={index} style={styles.restaurenAddress}>{innerItem.description}: {item[innerItem.type]}</Text>
            ))
          }
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: "white",
    height: 380,
    width: "90%",
    alignSelf: "center",
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#d4d4d4",
  },
  heading_wrapper: {
    width: '90%',
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: "#d4d4d4",
    alignSelf: 'center'
  },
  body_wrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignSelf: 'center',
    padding: 20,
  },
  dateTime: {
    position: "absolute",
    color: Colors.dark_gray,
    fontFamily: "Montserrat-Italic",
    top: 10,
    right: 20
  },
  restaurentName: {
    color: Colors.dark_gray,
    fontFamily: "Montserrat-ExtraBold",
    margin: 20,
  },
  restaurenAddress: {
    color: Colors.dark_gray,
    fontFamily: "Montserrat-Medium",
    marginLeft: 20,
    margin: 3,
    fontSize: 14,
  }
})


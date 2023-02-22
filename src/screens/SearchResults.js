import { View, Text, TouchableOpacity, Modal } from 'react-native'
import React, { useState, useEffect, useContext, useRef } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import EntityCard from '../components/InspectorSearch/EntityCard'
import { FlatList } from 'react-native-gesture-handler'
import { InspectorJobContext } from '../context/InspectorJobContext';
import { Colors, globalStyles } from '../components/styles'
import Filter from '../assets/images/react_svgs/Filter'
import GenericSorting from '../assets/images/react_svgs/GenericSorting'
import GenericSorting2 from '../assets/images/react_svgs/GenericSorting2'
import FilterModal from '../components/FilterModal'
import { useIsFocused } from '@react-navigation/native'
import EmptyEntity from '../components/InspectorSearch/EmptyEntity'

export default function SearchResults() {
    const inspectorJobContext = useContext(InspectorJobContext)
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const isFocused = useIsFocused()
    const flatListRef = useRef()
    const filterHandler = () => {
        setFilterModalVisible(true)
    }
    const sortHandler = () => {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
        inspectorJobContext.setOrdering(state => (state === 'ASC' ? 'DESC' : 'ASC'))
        inspectorJobContext.setPageNumber(1)

        inspectorJobContext.setSearchUpdateToggle({ status: true, type: 'sort' })

    }
    const updateFlatlistHandler = () => {
        if (inspectorJobContext.smartSeachResults >=20){
            inspectorJobContext.setPageNumber(state => (state + 1))
            inspectorJobContext.setSearchUpdateToggle({ status: true, type: 'update' })
        }
    }
    return (
        <ScreenWrapper navigationShow={false} sideBarShow = {false}>
            <FilterModal
                visible={filterModalVisible}
                setModalVisible={setFilterModalVisible}
                flatListRef = {flatListRef}
                // filteredItems={filteredItems}
                // setFilteredItems={setFilteredItems}
                onRequestClose={() => {
                    setFilterModalVisible(state => !state);
                }} />
            <View style={{
                width: '100%',
                height: 50,
                borderBottomColor: 'white',
                borderBottomWidth: 0.5,
                justifyContent: 'center'
                // backgroundColor:"white"
            }}>
                <Text
                    style={[globalStyles.h2_bold, { color: 'white' }]}>Search Results : {inspectorJobContext.smartSeachResults.count} </Text>

            </View>
            <View style={{
                width: '100%',
                height: 50,
                borderBottomColor: 'white',
                borderBottomWidth: 0.5,
                flexDirection: 'row'
                // backgroundColor:"white"
            }}>
                <TouchableOpacity
                    style={{ width: '50%', height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                    onPress={filterHandler}
                >
                    <Filter />

                    <Text
                        style={[globalStyles.h2_bold, { color: 'white' }]}
                    >
                        Filter
                    </Text>
                    {
                        inspectorJobContext.filteredItemsLength > 0 ?
                            <View
                                style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 25,
                                    backgroundColor: 'white',
                                    margin: 5,
                                    alignContent: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Text
                                    style={globalStyles.h2_bold}
                                >{inspectorJobContext.filteredItemsLength}</Text>
                            </View> : null}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={sortHandler}
                    style={{ width: '50%', height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                >
                    {
                        // TODO, need to change sorting on click
                        inspectorJobContext.ordering === 'DESC' ? <GenericSorting /> : <GenericSorting2 />}
                    <Text
                        style={[globalStyles.h2_bold, { color: 'white' }]}
                    >
                        Sort
                    </Text>
                </TouchableOpacity>

            </View>
            <FlatList
                ref= {flatListRef}
                data={inspectorJobContext.smartSeachResults.data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <EntityCard item={item}
                    />

                )}
                ListEmptyComponent={<EmptyEntity />}
                ListHeaderComponent={<View style={{ height: 20 }} />}
                ListFooterComponent={<View style={{ height: 300, padding: 50 }} />}

                onEndReached={updateFlatlistHandler}
                onEndReachedThreshold={0.01}

            />
        </ScreenWrapper>
    )
}
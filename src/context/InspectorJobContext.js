import React, {createContext, useContext, useState} from 'react';
import {useEffect} from 'react';
import {AxiosContext} from './AxiosContext';
import {ToastContext} from './ToastContext';

const InspectorJobContext = createContext(null);
const {Provider} = InspectorJobContext;

const InspectorJobProvider = ({children}) => {
  const {authAxios} = useContext(AxiosContext);
  // TODO, need to change the below later stage and pull the jobs from backend
  const [allZones, setAllZones] = useState([]);
  const [allAreaForSelectedZone, setAllAreaForSelectedZone] = useState([]);
  const [allSubAreaForSelectedArea, setAllSubAreaForSelectedArea] = useState(
    [],
  );
  const [allEntitiesForSelectedSubArea, setAllEntitiesForSelectedSubArea] =
    useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [ZonesearchText, setZonesearchText] = useState('');
  const [searchUrl, setSearchUrl] = useState('');
  const [smartSeachResults, setSmartSeachResults] = useState({
    count: 0,
    data: [],
  });
  const [filteredItems, setFilteredItems] = useState({});
  const [filteredItemsLength, setFilteredItemsLength] = useState(0);
  const [filteredItemsCount, setFilteredItemsCount] = useState(0);
  const [filterPartForUrl, setFilterPartForUrl] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInType, setSearchInType] = useState('');
  const [searchUpdateToggle, setSearchUpdateToggle] = useState({
    status: false,
    type: null,
  });
  // The above is used to update the search in InspectorSearch. It needs the types as sort, update
  const [searchValue, setSeachValue] = useState('');
  const [ordering, setOrdering] = useState('ASC');
  const toastContext = useContext(ToastContext);

  // const [couponsState, setCouponsState] = useState([]);

  const resetFilter = () => {
    setFilterPartForUrl('');
    setFilteredItems({});
    setFilteredItemsLength(smartSeachResults.count);
    setSearchUpdateToggle({status: true, type: 'filter'});
  };

  useEffect(() => {
    let quickResult = [];
    allZones.filter(obj => {
      let valuesOfObj = Object.values(obj);
      for (let i = 0; i < valuesOfObj.length; i++) {
        const item = valuesOfObj[i];
        if (typeof item === 'object') {
          let valuesOfInnerObj = Object.values(item);
          for (let i = 0; i < valuesOfInnerObj.length; i++) {
            const item = valuesOfInnerObj[i];
            if (
              item
                ?.toString()
                .toLowerCase()
                .includes(ZonesearchText.toLowerCase())
            ) {
              quickResult.push(obj);
              break;
            }
          }
        } else {
          if (
            item
              ?.toString()
              .toLowerCase()
              .includes(ZonesearchText.toLowerCase())
          ) {
            quickResult.push(obj);
            break;
          }
        }
      }
    });
    setFilteredZones(quickResult);
  }, [ZonesearchText, allZones]);

  // const searchHandler = new Promise ((resolve, reject)=>{

  // })

  // const searchHandler = (searchIn, searchType = 'new', pageNum=1,ordering='ASC') => {
  //   setSearchInType(searchIn)
  //   setPageNumber(pageNum)
  //   setOrdering(ordering)
  //   if (searchValue !== '') {
  //     // setBackendLoadingStatus('loading')
  //     const url = `/inspector_api/search/?search_in=${searchIn}&search_text=${searchValue}&search_type=results&page=${pageNumber}&ordering=${ordering}` + filterPartForUrl
  //     setSearchUrl(url)
  //     authAxios.get(url).then(response => {
  //       if (searchType === 'new'){
  //         setSmartSeachResults(response?.data)
  //       }
  //       else {
  //         setSmartSeachResults(state => ({ ...state, data: [...state.data, ...response?.data?.data] }))
  //       }
  //     })
  //       .catch(error => {
  //         let message = "Error occured, please try again !"

  //         if (error.message.includes("40")) {
  //           message = "No records available !"
  //         }
  //         else if (error.message.includes("50")) {
  //           message = "Please check your connection !"
  //         }
  //         toastContext.showToast(message, 'short', 'warning')
  //         setBackendLoadingStatus('error')

  //       })
  //   }
  // }

  useEffect(() => {
    let filters = '';
    setFilteredItemsLength(Object.keys(filteredItems).length);
    if (Object.keys(filteredItems).length !== 0) {
      Object.keys(filteredItems).map((item, index) => {
        filters += `&${item}_id_isfilter=${filteredItems[item].id}`;
      });
    }
    setFilterPartForUrl(filters);
    const url =
      searchUrl.replace('search_type=results', 'search_type=count') + filters;
    const lastKnownCount = filteredItemsCount;
    setFilteredItemsCount('loading');
    authAxios
      .get(url)
      .then(response => {
        setFilteredItemsCount(response.data.count);
      })
      .catch(error => {
        setFilteredItemsCount(lastKnownCount);
      });
  }, [filteredItems]);

  return (
    <Provider
      value={{
        allZones,
        setAllZones,
        selectedZone,
        setSelectedZone,
        ZonesearchText,
        setZonesearchText,
        filteredZones,
        setFilteredZones,
        smartSeachResults,
        setSmartSeachResults,
        searchUrl,
        setSearchUrl,
        filteredItems,
        setFilteredItems,
        filteredItemsLength,
        filteredItemsCount,
        setFilteredItemsCount,
        filterPartForUrl,
        resetFilter,
        pageNumber,
        setPageNumber,
        searchValue,
        setSeachValue,
        searchInType,
        setSearchInType,
        searchUpdateToggle,
        setSearchUpdateToggle,
        ordering,
        setOrdering,
        selectedEntity,
        setSelectedEntity,
        allAreaForSelectedZone,
        setAllAreaForSelectedZone,
        allSubAreaForSelectedArea,
        setAllSubAreaForSelectedArea,
        allEntitiesForSelectedSubArea,
        setAllEntitiesForSelectedSubArea,
      }}>
      {children}
    </Provider>
  );
};

export {InspectorJobContext, InspectorJobProvider};

import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tempJobs } from '../components/Jobs/tempJobLists';
import { useEffect } from 'react';
import moment from 'moment/moment'
import { AuthContext } from './AuthContext';

const DriverJobContext = createContext(null);
const { Provider } = DriverJobContext;

const DriverJobProvider = ({ children }) => {
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [categorizedJobs, setCategorizedJobs] = useState({
    Assigned: [],
    Processing: [],
    Completed: [],
  });
  const catagories = ["All", "Assigned", "Processing", "Completed"]
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobSearchText, setJobSearchText] = useState('');
  const [filteredCategory, setFilteredCategory] = useState('All');
  const [firstAndLastCollection, setFirstAndLastCollection] = useState({
    firstCollection: null,
    lastCollection: null
  })
  const authContext = useContext(AuthContext)

  useEffect(() => {
    setFilteredJobs(allJobs)
    let tempJobs = [...allJobs]
    if (authContext.authState?.userDetails?.user_type === 'Driver') {
      filtering(tempJobs)
    }
    else {
      getTimings(tempJobs)
    }
  }, [allJobs])

  useEffect(() => {
    if (authContext.authState?.userDetails?.user_type === 'Driver') {
      let quickResult = []
      let tempFilteredJob = []
      if (filteredCategory === 'All') {
        tempFilteredJob = [...allJobs]
      }
      else if (filteredCategory === 'Assigned'){
        tempFilteredJob = [...categorizedJobs.Assigned]
      }
      else if (filteredCategory === 'Processing'){
        tempFilteredJob = [...categorizedJobs.Processing]
      }
      else if (filteredCategory === 'Completed'){
        tempFilteredJob = [...categorizedJobs.Completed]
      }
      quickResult = tempFilteredJob?.filter(obj => Object.values(obj).some(val => {
        if (val?.establishment_name) {
          const stringToBeSearched = `${val?.establishment_name?.toLowerCase()} ${val?.subarea?.area?.area.toLowerCase()}`
          return stringToBeSearched.includes(jobSearchText.toLowerCase())
        }
        else {
          return false
        }
      }))
      setFilteredJobs(quickResult)
    }
  }, [jobSearchText, filteredCategory])

  const filtering = (tempJobs) => {
    let processingJobs = []
    let assignedJobs = []
    let completedJobs = []
    let tempTotalGreaseTrap = 0
    let tempGreaseCollectedTime = []
    tempJobs?.map(item => {
      tempTotalGreaseTrap += Number(item.total_gallon_collected)
      tempGreaseCollectedTime.push(moment(item.collection_completion_time))
      if (item.status === 'Assigned') {
        assignedJobs.push(item)
      }
      else if (item.status === 'Processing') {
        processingJobs.push(item)
      }
      else if (item.status === 'Completed') {
        completedJobs.push(item)
      }
    })
    const tempFirstCollection = moment.min(tempGreaseCollectedTime).format('DD-MM-YYYY hh:mm:ss A')
    const tempLastCollection = moment.max(tempGreaseCollectedTime).format('DD-MM-YYYY hh:mm:ss A')
    setFirstAndLastCollection({
      firstCollection: tempFirstCollection,
      lastCollection: tempLastCollection
    })
    setCategorizedJobs({
      Assigned: assignedJobs,
      Processing: processingJobs,
      Completed: completedJobs,
    })
  }
  const getTimings = (tempJobs) => {
    let tempTotalGreaseTrap = 0
    let tempGreaseCollectedTime = []
    tempJobs?.map(item => {
      tempGreaseCollectedTime.push(moment(item.collection_completion_time))
    })
    const tempFirstCollection = moment.min(tempGreaseCollectedTime).format('DD-MM-YYYY hh:mm:ss A')
    const tempLastCollection = moment.max(tempGreaseCollectedTime).format('DD-MM-YYYY hh:mm:ss A')
    setFirstAndLastCollection({
      firstCollection: tempFirstCollection,
      lastCollection: tempLastCollection
    })
  }

  return (
    <Provider
      value={{
        allJobs,
        setAllJobs,
        selectedJob,
        setSelectedJob,
        jobSearchText,
        setJobSearchText,
        filteredJobs,
        setFilteredJobs,
        categorizedJobs,
        setCategorizedJobs,
        // totalGreaseTrapCollected,
        firstAndLastCollection,
        catagories,
        filteredCategory,
        setFilteredCategory,
      }}>
      {children}
    </Provider>
  );
};

export { DriverJobContext, DriverJobProvider };

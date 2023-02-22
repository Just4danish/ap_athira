import moment from "moment/moment";
export const tempJobs = [
  {
    jobId: 12357,
    jobStatus: 'green',
    restaurantName: 'Layali Al Shams Royal',
    restaurantContact:{
      name: 'Jose',
      designation: "Manager",
      number: '00971558811233',
      email:'manager@restaurant.com'
    },
    address: 'Zone 3 - Karama',
    noOfTraps: 2,
    capacity: 1800,
    createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
    greaseTraps: [
      {
        trapId: "#678",
        trapStatus: "green",
        trapName: "Franke",
        capacity: 4000,
        greaseTrapCondition: null,
        waste_contents: null,
        coverCondition: null,
        buffleWallCondition: null,
        outletElbowCondition: null,
        beforePics: [
          {
            id: 123,
            name: 'a1.jpg',
            url: 'https://picsum.photos/536/354'
          },
          {
            id: 123,
            name: 'a1.jpg',
            url: 'https://media.wnyc.org/i/800/0/l/85/1/Numbers.png'
          },
          // {
          //   id: 123,
          //   name: 'a1.jpg',
          //   url: 'https://st.depositphotos.com/1007989/2764/i/450/depositphotos_27647955-stock-photo-colorful-numbers.jpg'
          // },
          // {
          //   id: 123,
          //   name: 'a1.jpg',
          //   url: 'https://picsum.photos/536/354'
          // },
        ],
        afterPics: [
          {
            id: 123,
            name: 'a1.jpg',
            url: 'https://thumbs.dreamstime.com/z/cartoon-abc-text-illustration-insect-theme-51089852.jpg'
          },
          {
            id: 123,
            name: 'a1.jpg',
            url: 'https://cdn.pixabay.com/photo/2014/02/27/16/10/flowers-276014__340.jpg'
          },
          {
            id: 123,
            name: 'a1.jpg',
            url: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg'
          },
          {
            id: 123,
            name: 'a1.jpg',
            url: 'https://image.shutterstock.com/image-photo/3d-wallpaper-design-waterfall-sea-260nw-1380925703.jpg'
          },
        ]
      },
      {
        trapId: "#952",
        trapStatus: "orange",
        trapName: "Dojke",
        capacity: 2000,
        greaseTrapCondition: null,
        waste_contents: null,
        coverCondition: null,
        buffleWallCondition: null,
        outletElbowCondition: null,
        beforePics: [],
        afterPics: [],
      },
      {
        trapId: "#851",
        trapStatus: "red",
        trapName: "Dilse",
        capacity: 3000,
        greaseTrapCondition: "Perfect",
        waste_contents: 'Damaged/Broken',
        coverCondition: 'Not Closing properly',
        buffleWallCondition: 'Damaged',
        outletElbowCondition: 'Unavailable',
        beforePics: [],
        afterPics: []
      }
    ] ,        
    timeLineData: [
      { time: '09:00', title: 'Initiated', description: 'Job initiated from Food Watch' },
      { time: '10:45', title: 'Assigned to vehicle', description: 'Assigned to Vehicle By Mr.Jose' },
      { time: '12:00', title: 'Assigned to driver', description: 'The job has been assigned to Mr.Mark' },
      { time: '14:00', title: 'Job strated', description: 'The job has been started by Mr.Mark at the restaurant' },
      { time: '16:30', title: 'Job finished', description: 'Mr.Mark has completed the Job' },
      { time: '18:30', title: 'Waste Dumped', description: 'Mr.Mark has deumped the waste at Envirol plant' }
    ],
  },
  {
    jobId: 12358,
    jobStatus: 'orange',
    restaurantName: 'Layali Al Shams Royal',
    restaurantContact:{
      name: 'Jose',
      number: '00971551234567',
      email:'manager@restaurant.com'
    },
    address: 'Zone 3 - Karama',
    noOfTraps: 2,
    capacity: 1800,
    createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
    greaseTraps: [],
    timeLineData: [
      { time: '09:00', title: 'Initiated', description: 'Job initiated from Food Watch' },
      { time: '10:45', title: 'Assigned to vehicle', description: 'Assigned to Vehicle By Mr.Jose' },
      { time: '12:00', title: 'Assigned to driver', description: 'The job has been assigned to Mr.Mark' },
      { time: '14:00', title: 'Job strated', description: 'The job has been started by Mr.Mark at the restaurant' },
      { time: '16:30', title: 'Job finished', description: 'Mr.Mark has completed the Job' },
      { time: '18:30', title: 'Waste Dumped', description: 'Mr.Mark has deumped the waste at Envirol plant' }
    ],
  },
  {
    jobId: 12359,
    jobStatus: 'red',
    restaurantName: 'Layali Al Shams Royal',
    restaurantContact:{
      name: 'Jose',
      number: '00971551234567',
      email:'manager@restaurant.com'
    },
    address: 'Zone 3 - Karama',
    noOfTraps: 1,
    capacity: 1800,
    createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
    greaseTraps: [],
    timeLineData: [
      { time: '09:00', title: 'Initiated', description: 'Job initiated from Food Watch' },
      { time: '10:45', title: 'Assigned to vehicle', description: 'Assigned to Vehicle By Mr.Jose' },
      { time: '12:00', title: 'Assigned to driver', description: 'The job has been assigned to Mr.Mark' },
      { time: '14:00', title: 'Job strated', description: 'The job has been started by Mr.Mark at the restaurant' },
      { time: '16:30', title: 'Job finished', description: 'Mr.Mark has completed the Job' },
      { time: '18:30', title: 'Waste Dumped', description: 'Mr.Mark has deumped the waste at Envirol plant' }
    ],
  },
  {
    jobId: 12360,
    jobStatus: 'orange',
    restaurantName: 'Layali Al Shams Royal',
    restaurantContact:{
      name: 'Jose',
      number: '00971551234567',
      email:'manager@restaurant.com'
    },
    address: 'Zone 3 - Karama',
    noOfTraps: 1,
    capacity: 1800,
    createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
    greaseTraps: [],
    timeLineData: [
      { time: '09:00', title: 'Initiated', description: 'Job initiated from Food Watch' },
      { time: '10:45', title: 'Assigned to vehicle', description: 'Assigned to Vehicle By Mr.Jose' },
      { time: '12:00', title: 'Assigned to driver', description: 'The job has been assigned to Mr.Mark' },
      { time: '14:00', title: 'Job strated', description: 'The job has been started by Mr.Mark at the restaurant' },
      { time: '16:30', title: 'Job finished', description: 'Mr.Mark has completed the Job' },
      { time: '18:30', title: 'Waste Dumped', description: 'Mr.Mark has deumped the waste at Envirol plant' }
    ],
  },
  {
    jobId: 12361,
    jobStatus: 'green',
    restaurantName: 'Layali Al Shams Royal',
    restaurantContact:{
      name: 'Jose',
      number: '00971551234567',
      email:'manager@restaurant.com'
    },
    address: 'Zone 3 - Karama',
    noOfTraps: 1,
    capacity: 1800,
    createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
    greaseTraps: [],
    timeLineData: [
      { time: '09:00', title: 'Initiated', description: 'Job initiated from Food Watch' },
      { time: '10:45', title: 'Assigned to vehicle', description: 'Assigned to Vehicle By Mr.Jose' },
      { time: '12:00', title: 'Assigned to driver', description: 'The job has been assigned to Mr.Mark' },
      { time: '14:00', title: 'Job strated', description: 'The job has been started by Mr.Mark at the restaurant' },
      { time: '16:30', title: 'Job finished', description: 'Mr.Mark has completed the Job' },
      { time: '18:30', title: 'Waste Dumped', description: 'Mr.Mark has deumped the waste at Envirol plant' }
    ],
  },
  {
    jobId: 12362,
    jobStatus: 'green',
    restaurantName: 'Layali Al Shams Royal',
    restaurantContact:{
      name: 'Jose',
      number: '00971551234567',
      email:'manager@restaurant.com'
    },
    address: 'Zone 3 - Karama',
    noOfTraps: 1,
    capacity: 1800,
    createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
    greaseTraps: [],
    timeLineData: [
      { time: '09:00', title: 'Initiated', description: 'Job initiated from Food Watch' },
      { time: '10:45', title: 'Assigned to vehicle', description: 'Assigned to Vehicle By Mr.Jose' },
      { time: '12:00', title: 'Assigned to driver', description: 'The job has been assigned to Mr.Mark' },
      { time: '14:00', title: 'Job strated', description: 'The job has been started by Mr.Mark at the restaurant' },
      { time: '16:30', title: 'Job finished', description: 'Mr.Mark has completed the Job' },
      { time: '18:30', title: 'Waste Dumped', description: 'Mr.Mark has deumped the waste at Envirol plant' }
    ],
  },
  {
    jobId: 12363,
    jobStatus: 'red',
    restaurantName: 'Layali Al Shams Royal',
    restaurantContact:{
      name: 'Jose',
      number: '00971551234567',
      email:'manager@restaurant.com'
    },
    address: 'Zone 3 - Karama',
    noOfTraps: 1,
    capacity: 1800,
    createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
    greaseTraps: [],
    timeLineData: [],
  },
];
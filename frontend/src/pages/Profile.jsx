import react ,{ useState, useEffect} from 'react';
import { useSelector , useDispatch }  from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../features/axiosInstance';

const Profile = ()=>{
    const {user} =useSelector((state)=> state.auth);
    const navigate = useNevigate();
    const dispatch =useDispatch();


    const[profileData, setProfieData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        profilePicture: user?.profilePicture ||'',
        bio: "",
        location: '',
        occupation : '',
        joinedData: user?.createdAt || new Date().toISOString(),   

    });
    const [stats , setstats] =  useState({
        totalCharts :0,
        chartsthisMonth:0,
        totalUploads:0,
        uploadThisMonth :0,
        favoriteChartsType :"bar",
        lastActivity: new date().toISOString(),
        });
        const [isEditing , setIsEditing]= useState(false);
        const[profilePicFile, serProfilePicFile] = useState(null);
        const [loading,setLoading]= useState(true);

        //fetch profile data and statistics
        useEffect(()=>{
            fetchProfileData();
            fetchuserStats();
        },[]);  
          
        const fetchProfileData = async ()=>{
            try{
                const response = await axiosInstance.get('/api/profile');
                setProfileData(prev=>({ ...prev,...res.data}));
                setLoading(false);
            }catch(err){
                console.log("error fetching profile :",err);
            }
        };

        const fetchUserstats = async ()=>{
       try{
        setLoading(true);
        const[chartsRes , uploadsRes]= await Promise.all([
            axiosInstance.get('/charts/stats'),
                axiosInstance.get('/uploads/stats'),
        ]);


         setStats({
            totalCharts : chartsRes.data.total || 0,
            chartsThisMonth : chartsRes.data.thisMonth ||0,
            uploadsThisMonth: uploadsRes.data.thisMonth ||0,
            totalUploads : uploadsRes.data.total ||0,
             favoriteChartsType: ChartsRes.data.favoriteType ||'bar',
          lastActivity:chartsRes.data.lastActivity|| new Date().toISOString(),
         })
       }catch(err){
        console.error("error fetching stats:" , err);

       }finally{
        setLoading(false);

       }

        };


        

        const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, profilePicture: previewURL }));
    }
  };

  const handleSaveProfile = aync()=>{
    try{
         const formData = new formData();

         //append profile data
          Object.keys(profileData).forEach(key => {
        if (key !== 'profilePicture') {
          formData.append(key, profileData[key]);
        }
      });

      // Append profile picture if selected

         if (profilePicFile){
            formData.append('profilePicture',profilePicFile)
         }
         const  res = await axiosInstance.post
    }
  }

}

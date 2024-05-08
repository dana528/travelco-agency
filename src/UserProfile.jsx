import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { db, storage } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './userProfile.css';
import OverviewIcon from './icons/logout-svgrepo-com.svg';
import SettingsIcon from './icons/logout-svgrepo-com.svg';
import LogoutIcon from './icons/logout-svgrepo-com.svg';
import Logo from './images/travelco.png';
import PlusIcon from './icons/add-svgrepo-com.svg';
import LeftArrowIcon from './icons/left-arrow-svgrepo-com (1).svg';
import Overview from './icons/dashboard-svgrepo-com.svg';
import Delete from './icons/delete.svg';
import Search from './icons/search-svgrepo-com.svg';
import Feedback from './icons/feedback-svgrepo-com.svg';
import Complaint from './icons/secret-question-solid-svgrepo-com.svg';
import Setting from './icons/settings-svgrepo-com.svg';
import Help from './icons/help-svgrepo-com.svg';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Notifications from './icons/notification-13-svgrepo-com.svg';
import Documnets from './icons/documents-svgrepo-com.svg';
import ProfileLink from './icons/link-svgrepo-com.svg';
import ShowMore from './icons/show-more-vertical-svgrepo-com.svg';
import Users from './icons/users-svgrepo-com.svg';
import Plus from './icons/plus-large-svgrepo-com.svg';
import Circle from './icons/circle-svgrepo-com.svg';


const UserProfile = () => {

  const [open, setOpen] = useState(false);
 

  //   // Function to handle logout
  // const handleLogout = async () => {
  //   try {
  //     // Perform logout operation (using Firebase sign-out method)
  //     await db.signOut();
  //     // Redirect to user's home page
  //     navigate('/');
  //   } catch (error) {
  //     console.error('Error logging out:', error);
  //     // Handle any errors, e.g., display error message
  //   }
  // };



  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [visaType, setVisaType] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isVisaTypeSelected, setIsVisaTypeSelected] = useState(false);
  const [visaTypeValidationError, setVisaTypeValidationError] = useState('');
  const [documentValidationError, setDocumentValidationError] = useState('');
  const [isFullNameSelected, setIsFullNameSelected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const segments = location.pathname.split('/');
  const userIdFromLink = segments[1];
  const [submittedData, setSubmittedData] = useState(null);

    
  const handleLogout = () =>{

    navigate(`/${userIdFromLink}`)
  }
  
  const sidebar = [
    {name:"Profile", url:"#", icon: Users},
    {name:"Feedbacks", url:"#", icon: Feedback},
    {name:"Complaints", url:"#", icon: Complaint},
    {name:"Settings", url:"#", icon: SettingsIcon},
    {name:"Help", url:"#", icon: Help},
    {name:"Logout", url:`/${userIdFromLink}/login` , icon: LogoutIcon },
    
  ]


  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userQuerySnapshot = await db.collection('users').doc(userId).get();
        if (userQuerySnapshot.exists) {
          setUserData(userQuerySnapshot.data());
          console.log("User data fetched successfully:", userQuerySnapshot.data());
        } else {
          console.log('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleFileChange = (event) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };

  
  const handleFullNameChange = (event) => {
    // Update the fullName state with the entered full name
    setFullName(event.target.value);
    // Update the isFullNameSelected state based on whether a full name is entered
    setIsFullNameSelected(!!event.target.value);
  };


  const handleVisaTypeChange = (event) => {
    setVisaType(event.target.value);
    setIsVisaTypeSelected(!!event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    console.log("Submitting form...");
  
    if (!isVisaTypeSelected) {
      console.log("Visa type not selected");
      setVisaTypeValidationError('Please select a visa type.');
      return;
    } else {
      console.log("Visa type selected");
      setVisaTypeValidationError('');
    }
  
    if (selectedFiles.length === 0) {
      console.log("No documents selected");
      setDocumentValidationError('Please upload at least one document.');
      return;
    } else {
      console.log("Documents selected");
      setDocumentValidationError('');
    }
  
    try {
      console.log("Uploading documents...");
      const fileUploadPromises = selectedFiles.map(file => {
        const storageRef = storage.ref(`user-docs/${userId}/${file.name}`);
        return storageRef.put(file);
      });
  
      const uploadSnapshots = await Promise.all(fileUploadPromises);
      const downloadUrls = await Promise.all(uploadSnapshots.map(snapshot => snapshot.ref.getDownloadURL()));
  
      console.log("Fetching existing document URLs...");
      const existingDocumentUrls = userData ? userData.documentUrls : [];
  
      console.log("Updating user profile...");
      await db.collection('users').doc(userId).set({
        fullName: userData.fullName, // Keep the existing full name
        visaType: visaType,
        documentUrls: [...existingDocumentUrls, ...downloadUrls], // Merge existing and new document URLs
      }, { merge: true });
  
      console.log("User profile updated successfully");
      toast.success('User profile updated successfully!');
  
      // Reset form fields
      setVisaType('');
      setFullName('');
      setSelectedFiles([]);
      setIsVisaTypeSelected(false);
      setIsFullNameSelected(false);
  
      // Clear any validation errors
      setVisaTypeValidationError('');
      setDocumentValidationError('');
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Error uploading documents. Please try again later.');
    }
  };
  
  return (
    <div className='w-full min-h-screen font-sans text-gray-500  sm:bg-gray-50 lg:bg-gray-50 md:bg-gray-50 flex'>
      <aside className={`py-6 px-10 w-64 border-r border-purple-50 bg-purple-50 shadow-md 
        ${open ? "sm:w-60 md:w-65 lg:w-75 w-75" : "w-1 sm:w-1 md:w-1 lg:w-1"
          } duration-300 relative fixed left-0 top-0 bottom-0 z-10`}>
          <div className="flex items-center gap-x-4">
          {/* <img src={Logo} alt='' className='w-9 sm:w-9 md:w-9 lg:w-11'/> */}
      <div className='inline-flex px-3'>
      <h1 className={`text-gray-600 origin-left font-medium lg:text-2xl md:text-xl sm:text-xl text-xl duration-300 py-3 ${!open && "scale-0"}`}>
      <strong class="self-center text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-purple-950">
      Travelco</strong></h1>
      </div>
      
      <img
          src={LeftArrowIcon}
          className={`w-8 h-8 bg-white text-dark-purple text-3xl rounded-full absolute -right-3 top-9 
          ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}/>
  
      </div>
      {open && (
      <ul className='flex flex-col gap-y-6 pt-28'>
        {sidebar.map((item, index) => (
          <li key={index} className='bg-purple-100 rounded-lg px-3 hover:bg-purple-300 hover:rounded-lg hover:px-3'>
           <a 
            href={item.url} 
            className='flex gap-x-4 items-start py-2 text-gray-500 hover:text-indigo-600 group'
          >
            <div className="absolute w-1.5 h-8 bg-purple-300 rounded-r-full left-0 scale-y-0 -translate-x-full group-hover:scale-y-100 group-hover:translate-x-0 transition-transform ease-in-out" />
            <img src={item.icon} alt={item.name}  className='w-6 h-6 fill-current' />
            {open && <div className='text-neutral-950 hover:text-black font-medium'>{item.name}</div>} {/* Render item name only when sidebar is open */}
          </a>
          </li>
        ))}
      </ul>
    )}
    </aside>
  
    {/* Main content here */}
      <main  className="pb-8 w-full ">
      
      {/* Start of the content 01 */}
      <div className="flex flex-col">
      {/* Users details header */}
      {/* Start 1st content 1st row */}
      <div className='flex items-center justify-between h-13 pb-0'>
        <h1 className="text-2xl font-semibold leading-relaxed text-purple-900 px-12 py-8" >Your Details</h1>  
      </div>

      <div className='py-1 px-10 ml-10 mr-10'>
        <div className="w-full">
      {userData ? (
        <div className="mx-auto max-w-xl lg:max-w-xl md:max-w-lg shadow-md">
          <form onSubmit={handleSubmit} className="w-100 dark:bg-purple-50 dark:border-purple-50 space-y-3 md:space-y-6 py-9 px-30 border-solid border-4 shadow-md">
    {/* Full Name Input */}
    <div>
        <label htmlFor="fullName" className="block mb-2 text-sm font-semibold  text-purple-950 dark:text-purple-950">Full Name</label>
        <input
            onChange={handleFullNameChange}
            type="text"
            name="fullName"
            id="fullName"
            value={fullName || (userData && userData.fullName)}
            required
            className="bg-white border border-gray text-purple-950 sm:text-sm rounded-lg focus:ring-purple-950 focus:border-purple-950 block w-full p-2.5 dark:bg-white dark:border-white dark:placeholder-purple-950 dark:text-purple-950 dark:focus:ring-purple-950 dark:focus:border-purple-950"
        />
    </div>

    {/* Email Input */}
    <div>
        <label htmlFor="email" className="block mb-2 text-sm font-semibold ext-purple-950 dark:text-purple-950">Email Address</label>
        <input
            type="email"
            name="email"
            id="email"
            value={userData.email}
            className="bg-white border border-gray text-purple-950 sm:text-sm rounded-lg focus:ring-purple-950 focus:border-purple-950 block w-full p-2.5 dark:bg-white dark:border-purple-50 dark:placeholder-purple-950 dark:text-purple-950 dark:focus:ring-purple-950 dark:focus:border-purple-950"
            readOnly
        />
    </div>

    {/* Visa Type Input */}
    <div>
        <label htmlFor="visaType" className="block mb-2 text-sm font-semibold ext-purple-950 dark:text-purple-950">Visa Type</label>
        <input
            onChange={handleVisaTypeChange}
            type="text"
            name="visaType"
            id="visaType"
            value={visaType}
            placeholder="ex:- Student visa, visit visa..."
            className="bg-white border border-gray text-purple-950 sm:text-sm rounded-lg focus:ring-purple-950 focus:border-purple-950 block w-full p-2.5 dark:bg-white dark:border-purple-50 dark:placeholder-gray-500 dark:text-purple-950 dark:focus:ring-purple-950 dark:focus:border-purple-950"
            required
        />
        {visaTypeValidationError && <div className="error">{visaTypeValidationError}</div>}
    </div>

    <div>
  <label htmlFor="uploadedDocs" className="block mb-2 text-sm font-semibold text-purple-950 dark:text-purple-950">Your Documents</label>
  <ul>
    {userData && userData.documentUrls.map((url, index) => (
      <li key={index} className="flex items-center ml-20">
      {/* Circle icon */}
      <img src={Circle} className="w-3 h-3 mr-2" />
      {/* Document link */}
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-purple-700">
        Document {index + 1}
      </a>
    </li>
    
    ))}
  </ul>
</div>



    {/* File Upload Input */}
    <div>
        <label htmlFor="documents" className="block mb-2 text-sm font-semibold ext-purple-950 dark:text-purple-950">Upload your Documents</label>
        <input
            type="file"
            name="documents"
            id="documents"
            multiple
            accept=".doc, .docx, .png, .jpg, .jpeg, .pdf"
            onChange={handleFileChange}
            required
            className="bg-purple-950 border border-purple-950 text-gray-950 sm:text-sm rounded-lg focus:ring-purple-950 focus:border-purple-950 block w-full p-2.5 dark:bg-white dark:border-purple-50 dark:placeholder-purple-950 dark:text-white dark:focus:ring-purple-950 dark:focus:border-purple-950 custom-input"
        />
        {documentValidationError && <div className="error">{documentValidationError}</div>}

        {/* Display Uploaded Documents */}
        <div>
            <label htmlFor="uploadedDocs" className="block mb-2 text-sm font-semibold text-purple-950 dark:text-purple-950">Uploaded Documents</label>
            <ul>
                {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                ))}
            </ul>
        </div>
    </div>

    {/* Submit Button */}
    <button
        type="submit"
        className="w-50 text-white bg-purple-950 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
    >
        Submit
    </button>

 
  

</form>


                    
               
      </div>
      ) : (
        <p>Loading...</p>
      )}
    
        </div>
        </div>
  
    </div>
    </main>
    <ToastContainer />
  </div>
  
    );

 
};

export default UserProfile;

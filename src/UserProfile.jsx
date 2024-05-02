import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { db, storage } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './userProfile.css';

const UserProfile = () => {
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
  
      console.log("Updating user profile...");
      await db.collection('users').doc(userId).set({
        fullName: userData.fullName, // Keep the existing full name
        visaType: visaType,
        documentUrls: downloadUrls,
      }, { merge: true });
      
      console.log("User profile updated successfully");
      toast.success('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Error uploading documents. Please try again later.');
    }
  };
  

  return (
    <div className='bg-slate-900 py-10 min-h-screen grid place-items-center'>
      <header className="w-full bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 fixed top-0 z-10">
        <nav className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a className="flex items-center">
            <strong className="self-center text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              Travelco Agency
            </strong>
          </a>
          <div className="flex items-center lg:order-2">
              <a className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-blue-500 focus:outline-none dark:focus:ring-gray-800"
              onClick={() => navigate(`/${userIdFromLink}/login`)}>
                Logout</a>
            </div>
        </nav>
      </header>
      <br /><br />

      <h1>
      <strong className="italic text-3xl font-normal text-gray-500 lg:text-3xl md:text-3xl sm:text-3xl dark:text-gray-400">
    Hello <strong className="text-blue-600 dark:text-blue-500">{userData ? userData.fullName : ''}</strong>
  </strong>
      </h1><br />
      <div className="sm:py-1 md:py-1 lg:py-0 xl:py-0">
        <h1 className="mb-2 text-gray-900 dark:text-white" style={{ fontFamily: "'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'" }}>
          <strong className="italic text-xl font-normal text-gray-500 lg:text-xl md:text-xl sm:text-xl dark:text-gray-400 px-6">
            <strong className="text-blue-600 dark:text-blue-500"></strong> Please review your <strong className="text-cyan-200">full name</strong> below. If there are any updates needed, <br />feel free to make changes. Kindly provide any other required details to complete your profile
          </strong>
        </h1>
      </div>
      {userData ? (
        <div>
          <div>
            <form onSubmit={handleSubmit} className="dark:bg-gray-800 dark:border-gray-700 space-y-3 md:space-y-6 py-9 px-30">
              <div>
                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                <input
                  onChange={handleFullNameChange}
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={fullName || (userData && userData.fullName)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={userData.email}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  readOnly
                />
              </div>
                        <div>
                            <label htmlFor="visaType" 
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Visa Type</label>
                            <input 
                              onChange={handleVisaTypeChange}
                              type="text" 
                              name="visaType" 
                              id="visaType" 
                              value = {visaType}
                              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                              // placeholder="Your email" 
                             required />
                             {visaTypeValidationError && <div className="error">{visaTypeValidationError}</div>}
                        </div>
                        <div>
                            <label htmlFor="documents" 
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload your Documents</label>
                            <input 
                            type="file" 
                            name="documents" 
                            id="documents" 
                            multiple accept=".doc, .docx, .png, .jpg, .jpeg, .pdf"
                            onChange={handleFileChange} 
                            required
                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                           />
                           {documentValidationError && <div className="error">{documentValidationError}</div>}
                        </div>
                        <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                          Submit</button>
                        
                    </form>
                </div>
           </div>
       
      
      
      ) : (
        <p>Loading...</p>
      )}
       <ToastContainer />
    </div>
  );
};

export default UserProfile;

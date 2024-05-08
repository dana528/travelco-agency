import React, { useState, useMemo ,useEffect} from 'react';
import { db } from './firebase';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Notifications from './icons/notification-13-svgrepo-com.svg';
import Documnets from './icons/documents-svgrepo-com.svg';
import ProfileLink from './icons/link-svgrepo-com.svg';
import ShowMore from './icons/show-more-vertical-svgrepo-com.svg';
import Users from './icons/users-svgrepo-com.svg';
import Plus from './icons/plus-large-svgrepo-com.svg';
import Close from './icons/close-circle-svgrepo-com.svg';


const Admin = () => {

  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dbRef = db.collection('users');
  const [searchValue, setSearchValue] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // here is the state manage the expanded state of each Row
  const [expandedRows, setExpandedRows] = useState({});


  // define state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  // Assuming filteredData is your array of user data
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

   // Here fetch users' Details from the DB
useEffect(() => {
  const fetchData = async () => {
    try {
      const querySnapshot = await dbRef.get();
      const fetchedData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return [data.fullName, data.email, data.visaType, data.documents, data.documentUrls, doc.id,data.completed]; // Include doc.id as userId and documentUrls
      });
      console.log(fetchedData);
      setOriginalData(fetchedData);
      setFilteredData(fetchedData); // Update filteredData with fetchedData
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('An error occurred while fetching data.');
    }
  };
  fetchData();
}, []);


   // sidebar options here
  const sidebar = [
    {name:"Users", url:"#", icon: Users},
    {name:"Feedbacks", url:"#", icon: Feedback},
    {name:"Complaints", url:"#", icon: Complaint},
  ]

  // function for handle user documents here
  const handleDownloadDocuments = (documentUrls) => {
    console.log('Downloading document:', documentUrls);
    if (documentUrls && documentUrls.length > 0) {
        
        documentUrls.forEach(documentUrl => {
            console.log('Download link:', documentUrl); 
        
            window.open(documentUrl, '_blank');
        });
    } else {
        
        console.log('No documents to download.');
    }
};

//
const handleDownloadDocument = (documentUrl) => {
  console.log('Downloading document:', documentUrl);
  // Open the URL in a new tab/window to initiate the download
  window.open(documentUrl, '_blank');
};



// Add new users 
const addNewUser = async (event) => {
  event.preventDefault();
  console.log("Full Name:", fullname);
  console.log("Email:", email);

  if (!fullname || !email) {
    toast.error('Please fill in all required fields.');
    return;
  }

  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    toast.error('This Email address already exists.');
  } else {
    try {
      await dbRef.add({ fullName: fullname, email: email });
      console.log('Added');
      toast.success('User added successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('An error occurred while adding the user.');
    }
  }
};

    // check whether the entereded email is already exist.
    const checkEmailExists = async (email) => {
        const querySnapshot = await dbRef.where('email', '==', email).get();
        return !querySnapshot.empty;
    };

    // toggle function for modal open
    const toggleModal = () => {
      console.log("Toggling modal...");
        setIsModalOpen(!isModalOpen);
    };
    
    // generate unique link for each user function
    const generateLink = (userId) => {
        const baseUrl = 'https://agency-doc-manage.web.app ';
        return `${baseUrl}/${userId}`;
    };


    // handle copy link to share with users
    const handleCopyLink = (userId) => {
        const link = generateLink(userId);
        navigator.clipboard.writeText(link)
            .then(() => toast.success('Link copied to clipboard'))
            .catch(() => toast.error('Failed to copy link'));
    };
 
    // handle search function - searach by email and name
    const handleSearch = (value) => {
      console.log('Search value:', value); // Add this line to see the value
    
      setSearchValue(value);
    
      // Check if the search input is empty
      if (value.trim() === '') {
        // If empty, reload the page
        setFilteredData(originalData);
      } else {
        // If not empty, filter the original data based on the search input
        const filtered = originalData.filter(item => {
          console.log('Item:', item); // Add this line to see the item being processed
          console.log('Name:', item[0]); // Access fullName at index 0
          console.log('Email:', item[1]); // Access email at index 1
          return (
            (item[0]?.toLowerCase().includes(value.toLowerCase()) || '') &&
            (item[1]?.toLowerCase().includes(value.toLowerCase()) || '')
          );
        });
        console.log('Filtered data:', filtered); // Add this line to see the filtered data
        setFilteredData(filtered);
      }
    };
    
    const toggleRow = (userId) => {
  setExpandedRows((prevState) => ({
    ...prevState,
    [userId]: !prevState[userId],
  }));
};

    

     // Function to render the document list for a user
     const renderDocumentList = (userId, documents) => {
      // Check if documents is defined
      if (!documents || documents.length === 0) {
        return <p>No documents added</p>;
      } else {
        return (
          <ul>
            {documents.map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        );
      }
    };
    
    // Function to delete a user
const deleteUser = async (userId) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this user?');
  if (confirmDelete) {
      try {
          await dbRef.doc(userId).delete();
          toast.success('User deleted successfully!');
      } catch (error) {
          console.error('Error deleting user:', error);
          toast.error('An error occurred while deleting the user.');
      }
  }
};

// get count of users 

// Function to get the count of all users

  const allUsersCount =  originalData.length;
  const completedUsersCount = originalData.filter(user => user[6] === true).length;
  const notCompletedUsersCount = originalData.filter(user => user[6] === false).length;



  
return (
  <div className='w-full min-h-screen font-sans text-gray-500 flex'>
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
  {/* <main className="pb-8 w-full pl-64"> */}
 
  <main className="flex-grow ">
    
    {/* Start of the content 01 */}
    <div className="flex flex-col">
    {/* Users details header */}
    {/* Start 1st content 1st row */}
    <div className='flex items-center justify-between h-13 pb-0'>
      <h1 className="text-2xl md:text-2xl lg:text-3xl sm:text-2xl font-semibold leading-relaxed text-purple-900 px-12 py-8" >Users' Details</h1>
      

      <div className="flex justify-between px-3 pt-2 py-4">
        {/* All Users Card */}
        <div className="mr-7 mt-5 w-40 bg-purple-50 shadow-md rounded-lg text-center text-sm py-3">
          <h3 className="font-semibold text-purple-500 ">Total Users</h3>
          <p className="font-bold text-purple-500">{allUsersCount}</p>
        </div>
        <div className="mr-7 mt-5 w-40 bg-purple-50 shadow-md rounded-lg text-center text-sm py-3">
          <h3 className="font-semibold text-green-500 ">Completed Users</h3>
          <p className="font-bold text-green-500">{completedUsersCount}</p>
        </div>
        <div className="mr-3 mt-5 w-40 bg-purple-50 shadow-md rounded-lg text-center text-sm py-3">
          <h3 className="font-semibold text-red-700 ">Not Completed Users</h3>
          <p className="font-bold text-red-700">{notCompletedUsersCount}</p>
        </div>
      </div>

      
      <div className='w-7 h-7  mr-6 mb-9'>
        <img src = {Notifications}/>
      </div>
    </div>
    {/* End 1st content 1st row */}

    {/* Search bar */}
    {/* start 1st content 2nd row */}
    <div className='flex items-center justify-between '>
   
    
      <div className='ml-9 mt-10 mb-10 lg:mb-10 sm:mb-8 md:mb-10 w-300 h-12 flex items-center justify-center' style={{ width: '300px',padding:'0.5rem',borderColor:'yellow' }}>
      <TextField 
        id='search'
        variant='outlined'
        placeholder='Search by Full Name or Email'
        className='h-full w-full text-purple'
        value={searchValue}
        onChange={ (e) => handleSearch(e.target.value)}
        InputProps={{ 
            style: { fontSize: '0.75rem',paddingTOP: '0.25rem',paddingBottom: '0.25rem',paddingLeft: '0.25rem',paddingRight: '0.25rem',borderColor:'', },
            endAdornment: ( // Render the search icon as an endAdornment
              <img 
                src={Search}
                alt='Search Icon'
                className='w-5 h-5 cursor-pointer'
                onClick={() => handleSearch(searchValue)}
              />
            )
        }}
      />

      </div>
    
    

    {/* Modal button */}
    <div className=''>
    <button
        onClick={toggleModal}
        class="inline-flex bg-purple-800 mr-10 px-3 py-1.5 rounded-lg"
      >

{isModalOpen && (
  <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-30 flex justify-center items-center">
    <form onSubmit={(e) => { e.preventDefault(); addNewUser(e); }} className="space-y-6 relative">
      <button className="absolute top-3 right-3" onClick={() => setIsModalOpen(false)}>
        <img src={Close} className='w-5 h-5'/>
      </button>
      <h3 className="text-center text-lg font-semibold text-purple-950 dark:text-purple-950 mb-6">User's Details</h3>
      <div>
        <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-purple-950 dark:text-purple-950 text-left">Full Name</label>
        <input
          type="text"
          id="fullName"
          placeholder="User's full name"
          value={fullname}
          required
          className="border border-gray-300 text-purple-950 sm:text-sm rounded-lg block w-full p-2.5 bg-white dark:border-white dark:placeholder-purple-950 dark:text-black dark:focus:ring-purple-950 dark:focus:border-white"
          onChange={(e) => setFullName(e.target.value)} // Updated this line
        />
      </div>
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-purple-950 dark:text-purple-950 text-left">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="User's email"
          value={email}
          className="border border-gray-300 text-purple-950 sm:text-sm rounded-lg block w-full p-2.5 bg-white dark:border-white dark:placeholder-purple-950 dark:text-black dark:focus:ring-purple-950 dark:focus:border-white"
          required
          onChange={(e) => setEmail(e.target.value)} // Updated this line
        />
      </div>
      <button type="submit" className="w-full text-white bg-purple-950 hover:bg-purple-950 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-950 dark:hover:bg-purple-950 dark:focus:ring-primary-800">Add</button>
    </form>
  </div>
)}




      {/* Modal button */}
      <img src={Plus} className='w-4 h-4 fill-current pt-1 text-white'/>
      <div  className="text-sm font-semibold tracking-wide text-white">Add New</div>
      </button>
      {/* End 1st content 2nd row */}
    </div>
    </div>
    {/* End 1st column 2nd row */}
  </div>
  {/* End of the content 01*/}
      
  {/* Table Content (Second Row) */}
  <div className='py-7 px-20 '>
  <table className="w-full shadow-md">
    <thead>
      <tr className="text-sm font-medium text-white">
        <td className="bg-purple-900 border-solid rounded-tl-md  py-3 px-4 text-left">Full Name</td>
        <td className="bg-purple-900   py-3 px-4 text-left">Email Address</td>
        <td className="bg-purple-900  py-3 px-4 text-left">Visa Type</td>
        <td className="bg-purple-900  py-3 px-4 text-center">Documents</td>
        <td className="bg-purple-900  py-3 px-4 text-center">Profile Link</td>
        <td className="bg-purple-900   py-3 pr-10 pl-4 text-center border-solid rounded-tr-md "></td>
      </tr>
    </thead>
    <tbody>
  {currentUsers.length > 0 ? (
    currentUsers.map((userData, index) => {
      const userId = userData[5]; // Assuming the userId is the last item in the userData array
      const isExpanded = expandedRows[userId];
      return (
        <React.Fragment key={index}>
          <tr key={index} className="border-b border-t border-solid bg-purple-50 hover:bg-purple-300 transition-colors group border-b text-sm font-medium">
            <td className="py-4 md:py-4 lg:py-4 sm:py-4 px-4 text-left text-black">{userData[0]}</td>
            <td className="py-4 md:py-4 lg:py-4 sm:py-4 px-4 text-left text-black">{userData[1]}</td>
            <td className="py-4 md:py-4 lg:py-4 sm:py-4 px-4 text-left">{userData[2]}</td>
            <td className="py-4 md:py-4 lg:py-4 sm:py-4 px-4 text-center flex justify-center items-center">
              <img
                src={Documnets}
                alt="Documents Icon"
                className="w-5 h-5 cursor-pointer"
                onClick={() => toggleRow(userId)}
              />
              {/* Conditionally render the expanded content */}
            </td>
            <td className="py-4 md:py-4 lg:py-4 sm:py-4 px-4 text-center">
              <button onClick={() => handleCopyLink(userId)}>
              <img src={ProfileLink} className="w-5 h-5" alt="link" />
              </button>
            </td>
            <td className="py-4 md:py-4 lg:py-4 sm:py-4 px-4 text-center ">
              <button onClick={() => deleteUser(userId)}>
                <img src={Delete} className="w-5 h-5" alt="Delete" />
              </button>
            </td>
            
          </tr>
          {/* Additional details for the expanded row */}
          {isExpanded && (
  <tr className='text-center align-middle'>
    <div className="mx-auto ml-10">
    <td colSpan="6" className='text-center'>
    
      {userData[4] && Array.isArray(userData[4]) && userData[4].length > 0 ? (
        <table >
          <tbody className=' w-full shadow-md'>
            {userData[4].map((docUrl, docIndex) => {
              const docName = `Document ${docIndex + 1}`;
              return (
                <tr key={docIndex} className='border-b border-t px-5 py-7 ml-2 mr-2 bg-blue-50'>
                  {/* Document Name */}
                  <td>
                    <strong className='text-sm py-2 px-3'>{docName}</strong>
                  </td>
                  {/* Download Button */}
                  <td className="ml-2">
                    <button
                      onClick={() => handleDownloadDocument(docUrl)}
                      className="text-purple-950 text-sm hover:text-blue-900 focus:outline-none py-2 px-3"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className='text-sm text-black text-center text-semibold text-gray-500 px-3 py-1 ml-2 mr-2 '>No documents added yet</p>
      )}
      
    </td>
    </div>
  </tr>
)}

        </React.Fragment>
      );
    })
  ) : (
    <tr>
      <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
        No user data available
      </td>
    </tr>
  )}
</tbody>

  </table> 
</div>

{/* Pagination Controls (Third Row) */}
<div className="flex justify-center pt-1 w-full">
  <button
    className={`flex justify-center items-center w-7 h-7 font-medium rounded-full ${
      currentPage === 1 ? 'text-purple-950 hover:text-black hover:bg-purple-300' : 'text-purple-950 hover:text-black hover:bg-purple-300'
    }`}
    onClick={() => paginate(currentPage - 1)}
    disabled={currentPage === 1}
  >
    {'<'}
  </button>
  {[...Array(Math.ceil(filteredData.length / usersPerPage))].map((_, i) => (
    <button
      key={i}
      className={`flex items-center justify-center w-7 h-7 font-medium rounded-full ${
        currentPage === i + 1 ? 'text-purple-950 hover:text-black hover:bg-purple-300' : 'text-purple-950 hover:text-black hover:bg-purple-300'
      }`}
      onClick={() => paginate(i + 1)}
    >
      {i + 1}
    </button>
  ))}
  <button
    className={`flex justify-center items-center w-7 h-7 font-medium rounded-full ${
      currentPage === Math.ceil(filteredData.length / usersPerPage) ? 'text-purple-950 hover:text-black hover:bg-purple-300' : 'text-purple-950 hover:text-black hover:bg-purple-300'
    }`}
    onClick={() => paginate(currentPage + 1)}
    disabled={currentPage === Math.ceil(filteredData.length / usersPerPage)}
  >
    {'>'}
  </button>
</div>


  </main>
  
  <ToastContainer />
</div>

  );
}



export default Admin;

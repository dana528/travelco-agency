import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import './Home.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material';
import defaultImageUrl from './images/profile.png';

const Home = () => {
    const [data, setData] = useState([]);
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dbRef = db.collection('users');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await dbRef.get();
                const fetchedData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return [data.fullName, data.email, data.visaType, data.documents, data.documentUrls, doc.id]; // Include doc.id as userId and documentUrls
                });
                setData(fetchedData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('An error occurred while fetching data.');
            }
        };
        fetchData();
    }, []);

    const options={
      selectableRows:false,
      elevation:0,
      rowsPerPage:5,
      rowsPerPageOptions:[5,10,15,20],
    }
    

    const getMuiTheme = () =>{
      return createTheme({
        typography:{
          // fontFamily:"Poppins",
        },
        palette: {
          background:{
            paper:"#1e293b",
            default:"#0f172a"
          },
          mode: "dark",
        },
        components:{
          MuiTableCell:{
            styleOverrides:{
              head:{// full name,email row....
                padding:"10px 4px",
                color: "#0000"


              },
              body:{
                padding:"7px 15px",
                

              }
            }
          }
        }

      });

      }

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

const handleDownloadDocument = (documentUrl) => {
    console.log('Downloading document:', documentUrl);
    // Open the URL in a new tab/window to initiate the download
    window.open(documentUrl, '_blank');
};



    const addNewUser = async () => {
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
                toast.success('User added successfully!');
                setIsModalOpen(false);
            } catch (error) {
                console.error('Error adding user:', error);
                toast.error('An error occurred while adding the user.');
            }
        }
    };

    const checkEmailExists = async (email) => {
        const querySnapshot = await dbRef.where('email', '==', email).get();
        return !querySnapshot.empty;
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    

    const generateLink = (userId) => {
        return `http://localhost:3000/${userId}`;
    };

    const handleCopyLink = (userId) => {
        const link = generateLink(userId);
        navigator.clipboard.writeText(link)
            .then(() => toast.success('Link copied to clipboard'))
            .catch(() => toast.error('Failed to copy link'));
    };

    // const defaultImageUrl = './images/profile.png';
    
    const columns = [
      {
      name:'Full Name',
      label: "Full Name",

    },
    {
      name:'Email',
    },
    {
      name:'Visa Type',
      // options:{
      //   customBodyRender:(value) => <p
      //   className={`Capitalize px-3 py-1 inline-block`}
      //   ></p>
      // }
    }, 
    {
    name: 'Profile Link',
    // options: {
    //     customBodyRender: (value, tableMeta, updateValue) => {
    //         const userId = data[tableMeta.rowIndex][5]; 
    //         return (
    //             <button className="bg-rose-600 px-3 py-1 rounded-md" onClick={() => handleCopyLink(userId)}>Profile</button>
    //         );
    //     }
    // }
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
          const userId = data[tableMeta.rowIndex][5]; 
          return (
              <button className="bg-blue-500 px-3 py-1 rounded-md" onClick={() => handleCopyLink(userId)}>Link</button>
          );
      }
  }
}, {
    name: 'Documents',
    options: {
        customBodyRender: (value, tableMeta, updateValue) => {
            const documentUrls = data[tableMeta.rowIndex][4]; 
            console.log("Document URLs:", documentUrls); 
            if (documentUrls && documentUrls.length > 0) {
                return (
                    <ul>
                        {documentUrls.map((docUrl, index) => (
                            <li key={index}>
                                <button onClick={() => handleDownloadDocument(docUrl)}>Document {index + 1}</button>
                            </li>
                        ))}
                    </ul>
                );
            } else {
                return '-';
            }
        }
    }
}];

    return (
        <>
            <div className="bg-slate-900 py-10 min-h-screen grid place-items-center">
            <header className="w-full bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 fixed top-0 z-10">
        <nav className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a className="flex items-center">
            <strong className="self-center text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              Travelco Agency
            </strong>
          </a>
          <div className="flex items-center lg:order-2">
              <a
               onClick={toggleModal}
              className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-blue-500 focus:outline-none dark:focus:ring-gray-800"
              >
                Add Users</a>
            </div>
        </nav>
      </header>
                {/* <div className="flex justify-end">
                    <button
                        onClick={toggleModal}
                        className="top-right-button block text-white bg-purple-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                    >
                        Add User
                    </button>
                </div> */}
                
                    <ThemeProvider theme={getMuiTheme}>
                    
                    <h1 className="py-10 mb-2 text-5xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-5xl lg:text-6xl" style={{ fontFamily: "'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'" }}>
      
      <strong className="py-8 text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"> Users' Details </strong></h1>
                        <MUIDataTable
                            title={""}
                            data={data}
                            columns={columns}
                            options={options}
                        />
                       
                    </ThemeProvider>
                
            </div>
            {isModalOpen && (
    <div className="modal-container dark:bg-gray-800 dark:border-gray-700 space-y-3 md:space-y-6 py-9 px-30">
        <div >
            <form onSubmit={addNewUser}  className="dark:bg-gray-800 dark:border-gray-700 space-y-3 md:space-y-6 py-9 px-30">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-x"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#000000"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
                
                    <label htmlFor="fullName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >Full Name</label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullname}
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        onChange={(e) => setFullName(e.target.value)}

                    />
                
                <div className="box">
                    <label htmlFor="email" 
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input
                        type="email"
                        name='email'
                        placeholder="Email"
                        value={email}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" >Add</button>
            </form>
        </div>
    </div>
)}


            <ToastContainer />
        </>
    );
};

export default Home;

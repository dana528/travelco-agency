import React, { useState } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import { db } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Main = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const segments = location.pathname.split('/');
  const userIdFromLink = segments[1];

const inputs = [

  {
    id: 1,
    name: "email",
    type: "email",
    placeholder: "Email",
    errorMessage: "It should be a valid email address!",
    label: "Email",
    required: true,
  },
 
];

    const getUserData = async (userId) => {
        try {
          const userQuerySnapshot = await db.collection('users').doc(userId).get(); // Fetch user by userId
          if (userQuerySnapshot.exists) {
            return userQuerySnapshot.data();
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          throw new Error('Error fetching user data: ' + error.message);
        }
      };
      

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            console.log('userIdFromLink:', userIdFromLink); // Log userIdFromLink
            // Fetch user data from the database
            const userData = await getUserData(userIdFromLink);
            console.log("userdata email",userData.email);
            console.log("values email",values.email);
            
            // Verify if the entered email matches the user's email
            if (userData.email === values.email) {
              toast.success("You have successfully LoggedIn");
                // If it matches, navigate to the UserProfile component with userId and email
                setTimeout(() => {
                  navigate(`/${userIdFromLink}/${values.email}`);
                }, 2000);
                
            } else {
                // If it doesn't match, show an error message or handle it accordingly
                // alert('Email does not match the user ID.');
                toast.error("Email does not match the user ID")

            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle error fetching user data
            // alert('Error fetching user data. Please try again.');
            toast.error("Error fetching user data. Please try again")
        }
    };


    const onChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value });
    };
    
    return (
    

      <div className='w-full h-screen'>
  <img
    className='absolute top-0 left-0 w-full h-full object-cover'
    src='https://img.freepik.com/free-photo/island-sea-with-plane-wing_1339-517.jpg?t=st=1714939577~exp=1714943177~hmac=4a42605cf12595b43cf2544da7919c7b0b0a267a14a530a8cf7be82a73313004&w=1060'
    alt='/'
  />
 
 <header className="w-full bg-transparent px-4 lg:px-6 py-2.5 fixed top-0 z-10 transition-shadow duration-300 hover:shadow-lg">
  <nav className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl h-10">
      <a className="flex items-center">
        <strong className="self-center text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 text-white">
          Travelco Agency
        </strong>
      </a>
      <div className="flex items-center lg:order-2">
        <a className="text-white text-gray-800 dark:text-white hover:bg-black hover:text-white focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-purple-900 focus:outline-none dark:focus:ring-gray-800"
          onClick={() => navigate(`/${userIdFromLink}/login`)}>
          Log in
        </a>
      </div>
    </nav>
  </header>


  <section className="absolute inset-0 flex items-center justify-center transition-shadow duration-300 hover:shadow-lg bg-black bg-opacity-30">
  <div className="max-w-md mx-auto bg-white bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg shadow-lg p-8">
    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
      Enter your Email to Continue
    </h1>
    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6 py-4 px-7 bg-black bg-opacity-0">
      <input
        onChange={onChange}
        type="email"
        name="email"
        id="email"
        value={values.email}
        className="bg-gray-50 bg-opacity-0 border border-white text-white dark:bg-gray-700 dark:bg-opacity-50 dark:border-white dark:text-white dark:placeholder-white focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 rounded-lg"
        placeholder="Your email"
        required
      />
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 bg-opacity-50 dark:bg-gray-700 dark:bg-opacity-50 dark:border-gray-600 dark:focus:ring-gray-600 dark:ring-offset-gray-800 focus:ring-3 focus:ring-primary-300"
              
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="remember" className="text-white dark:white">Remember me</label>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full text-white bg-purple-900 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        Verify
      </button>
    </form>
  </div>
</section>



  <ToastContainer />
</div>

       
    
    );
  };
  
  export default Main;
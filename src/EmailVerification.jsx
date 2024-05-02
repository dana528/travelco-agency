import React, { useState } from 'react';
import { useNavigate , useLocation} from 'react-router-dom';
import { db } from './firebase';
import './emailVerification.css';
import FormInput from "./components/FormInput";


const EmailVerification = () => {
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
    const login = segments[0];
    const index1 = segments[2];



const inputs = [
  // {
  //   id: 1,
  //   name: "username",
  //   type: "text",
  //   placeholder: "Username",
  //   errorMessage:
  //     "Username should be 3-16 characters and shouldn't include any special character!",
  //   label: "Username",
  //   pattern: "^[A-Za-z0-9]{3,16}$",
  //   required: true,
  // },
  {
    id: 1,
    name: "email",
    type: "email",
    placeholder: "Email",
    errorMessage: "It should be a valid email address!",
    label: "Email",
    required: true,
  },
  // {
  //   id: 3,
  //   name: "birthday",
  //   type: "date",
  //   placeholder: "Birthday",
  //   label: "Birthday",
  // },
  // {
  //   id: 4,
  //   name: "password",
  //   type: "password",
  //   placeholder: "Password",
  //   errorMessage:
  //     "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
  //   label: "Password",
  //   pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
  //   required: true,
  // },
  // {
  //   id: 5,
  //   name: "confirmPassword",
  //   type: "password",
  //   placeholder: "Confirm Password",
  //   errorMessage: "Passwords don't match!",
  //   label: "Confirm Password",
  //   pattern: values.password,
  //   required: true,
  // },
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
            
            // Verify if the entered email matches the user's email
            if (userData.email === values.email) {
                // If it matches, navigate to the UserProfile component with userId and email
                navigate(`/${userIdFromLink}/${values.email}`);
            } else {
                // If it doesn't match, show an error message or handle it accordingly
                alert('Email does not match the user ID.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Handle error fetching user data
            alert('Error fetching user data. Please try again.');
        }
    };

    const onChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value });
    };
    
    return (
      <div className='wrapper bg-slate-900 py-10 min-h-screen grid place-items-center'>
        <header className="w-full bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 fixed top-0 z-10">
          <nav className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a  className="flex items-center">
              {/* <img src="./images/travelco.png" className="mr-3 h-6 sm:h-9" alt="logo" /> */}
              <strong class="self-center text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              {/* text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 */}
                Travelco Agency</strong>
            </a>
            <div className="flex items-center lg:order-2">
              <a className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-blue-500 focus:outline-none dark:focus:ring-gray-800"
              onClick={() => navigate(`/${userIdFromLink}/login`)}>
                Log in</a>
            </div>
            <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                {/* Add your menu items here */}
              </ul>
            </div>
          </nav>
        </header>

        <br></br><br></br><br></br><br></br><br></br><br></br>

        <h1 className="mb-2 text-5xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-5xl lg:text-6xl" style={{ fontFamily: "'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'" }}>
      Welcome to
      <strong className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400"> Travelco Agency ! </strong>
      <br></br><br></br>
      <strong class="italic text-3xl font-normal text-gray-500 lg:text-2xl md:text-xl sm:text-xl  dark:text-gray-400"> 
      <strong class="text-blue-600 dark:text-blue-500">Log in</strong> to continue and confidently provide your details. </strong>
    </h1>

    

    <footer>
                <footer>
                    <div >
                        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400"></span>
                    </div>
                </footer>
            </footer>

    
    
   


        {/* <div className='text-center'>
          <form className='bg-violet-300 rounded-2xl' onSubmit={handleSubmit}>
            {inputs.map((input) => (
              <FormInput
                key={input.id}
                {...input}
                value={values[input.name]}
                onChange={onChange}
              />
            ))}
            <button className="btn" type="submit">Verify</button>
          </form>
        </div> */}
      </div>
    );
  };
  
  export default EmailVerification;
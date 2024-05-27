import React, { useContext } from 'react'
import AuthLayout from '../../layout/authLayout'
import Fields from '../../components/auth/fields'
import { authContext } from '../../service/auth_context/authContext'
import "./auth.css"
const Login = () => {      
  const { get_login_values, login_button } = useContext(authContext)
  
  return (
    <AuthLayout>
       <Fields data={data} marginTop={8} header="Login as user" autLink="Signup as a user"forgetPassword="forgot password" event={get_login_values} handle={login_button} nav={"user-signup"} token={null}/>
    </AuthLayout>
  )
}

const data = [
    {
        id: 0,
        type: "email",
        name: "email",
        placeholder:"Email"
    },
    {
        id: 0,
        type: "password",
        name: "password",
        placeholder:"Password"
    }
]

export default Login

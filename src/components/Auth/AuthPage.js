import React, { useState } from 'react';
import Login from './Login';
import Signup from './SignUp';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-container">
            {isLogin ? <Login /> : <Signup />}
            <p className="toggle-text">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
                    {isLogin ? " Sign Up" : " Log In"}
                </button>
            </p>
        </div>
    );
};

export default AuthPage;

import React, { useState } from 'react'
import { supabase } from "../supabase";
import bgImg from '../assets/bg_img.png'

const authPage = ({onAuthSuccess}) => {

    const[mode,setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const isSignup = mode === "signup";

    const handleSignup = async () => {
      setLoading(true);
      setErrorMsg("");
    
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
    
        if (error) throw error;
    
        const user = data.user;
    
        if (!user) {
          setErrorMsg("Check your email to confirm your account.");
          return;
        }
    
        // Update profile row created by the trigger
        const { error: updateErr } = await supabase
          .from("profiles")
          .update({ username })
          .eq("id", user.id);
    
        if (updateErr) throw updateErr;
    
        onAuthSuccess(user);
      } 
      catch (err) {
        setErrorMsg(err.message);
      } 
      finally {
        setLoading(false);
      }
    };
    
    const handleLogin = async () =>{
        setLoading(true);
        setErrorMsg("");

        try {
           const{data,error} = await supabase.auth.signInWithPassword({
            email,
            password
           });

           if(error) throw error;
           onAuthSuccess(data.user);
        } 
        catch (err) {
           setErrorMsg(err.message);
        }
        finally{
            setLoading(false);
        }
    }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6"
      style={{ 
        fontFamily: "'Montserrat', 'Roboto', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >

        
        <div className="text-center mb-8 w-full max-w-md">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#6D5DF6] to-[#1C2A4A] bg-clip-text text-transparent">Docura</h1>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6D5DF6] to-[#1C2A4A] bg-clip-text text-transparent">
            Turn documents into conversations
          </h2>
          <p className="text-md min-h-[1.25rem] bg-gradient-to-r from-[#6D5DF6] to-[#1C2A4A] bg-clip-text text-transparent">
            Stop searching... Start asking!!!
          </p>
        </div>
        <div className="w-full max-w-md bg-white/45 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">

        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-[#6D5DF6] to-[#1C2A4A] bg-clip-text text-transparent">
          {isSignup ? "Sign Up" : "Login"}
        </h1>

        {errorMsg && (
          <p className="bg-red-100 text-red-700 p-2 rounded text-sm">
            {errorMsg}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-[#4338CA] rounded-lg focus:ring focus:ring-indigo-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {isSignup && (
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-[#4338CA] rounded-lg focus:ring focus:ring-indigo-300 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-[#4338CA] rounded-lg focus:ring focus:ring-indigo-300 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          onClick={isSignup ? handleSignup : handleLogin}
          className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-60 transition cursor-pointer"
        >
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Login Now"}
        </button>

        <p
          className="text-center text-indigo-600 cursor-pointer hover:underline"
          onClick={() => setMode(isSignup ? "login" : "signup")}
        >
          {isSignup
            ? "Already have an account? Login here"
            : "Don't have an account? Sign Up"}
        </p>

        </div>
    </div>
  )
}

export default authPage
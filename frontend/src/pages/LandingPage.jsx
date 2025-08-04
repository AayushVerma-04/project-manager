import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const nav = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Task Manager</h1>
        <p className="text-2xl opacity-90">Overwhelmed with tasks? We got you!</p>
        <p className="text-lg opacity-90">Start your journey now</p>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:scale-105 hover:bg-blue-100 transition-all duration-300"
          onClick={() => nav('/login')}
        >
          Login
        </button>
        <button
          className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:scale-105 hover:bg-purple-100 transition-all duration-300"
          onClick={() => nav('/signup')}
        >
          Signup
        </button>
      </div>

    </div>
  );
};

export default LandingPage;

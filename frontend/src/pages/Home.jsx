import { useEffect, useState } from 'react'
import axios from 'axios'
import ProjectCard from '../components/ProjectCard'
import useAuthContext from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom';

// Assuming Modal.js is in the same directory, or adjust the path
import Modal from '../components/Modal';

const baseURL = import.meta.env.VITE_API_BASE_URL

// --- Join Project Logic & UI (Integrated) ---
const JoinProjectModal = ({ isOpen, onClose, onProjectJoined }) => {
  const [projectCode, setProjectCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (projectCode.trim() === '') {
      setError('Please enter a project code.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/project/join`,
        { code: projectCode },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      //console.log('Successfully joined project:', response.data);
      onProjectJoined(response.data); // Notify the parent component of the new project
      //console.log(response)
      onClose();

    } catch (err) {
      console.error('Failed to join project:', err);
      setError(err.response?.data?.message || 'Failed to join project. Please check the code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Join a Project"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectCode" className="block text-sm font-medium text-gray-700">
            Enter Project Code
          </label>
          <input
            type="text"
            id="projectCode"
            value={projectCode}
            onChange={(e) => setProjectCode(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Joining...' : 'Join Project'}
        </button>
      </form>
    </Modal>
  );
};
// --- End Join Project Logic & UI ---


// --- Create Project Logic & UI (Integrated) ---
const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (projectTitle.trim() === '') {
      setError('Project title is required.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/project/`,
        { title: projectTitle, description: projectDescription },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      //console.log('Successfully created project:', response.data);
      onProjectCreated(response.data);
      onClose();
      navigate(`/projects/${response.data._id}`); // Navigate to the new project page
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err.response?.data?.message || 'Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create a New Project"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700">
            Project Title
          </label>
          <input
            type="text"
            id="projectTitle"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
            Project Description (Optional)
          </label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </Modal>
  );
};
// --- End Create Project Logic & UI ---

const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false); // State for the join modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for the create modal

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        // No need to get token from localStorage, useAuthContext provides it
        if (!user || !user.token) {
          throw new Error('User not authenticated.');
        }

        const [response1, response2] = await Promise.all([
          axios.get(`${baseURL}/api/user/myprojects`, {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          axios.get(`${baseURL}/api/user/otherprojects`, {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        ])

        setProjects([...response1.data, ...response2.data])
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user && user.token) {
      fetchProjects()
    }
    
  }, [user]) // Add user to the dependency array

  const handleProjectJoined = (newProject) => {
    // Add the newly joined project to the state
    setProjects(prevProjects => [...prevProjects, newProject]);
  };
  
  const handleProjectCreated = (newProject) => {
    // Add the newly created project to the state
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-20 px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Collaborate on Projects</h1>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl">
          Start a new project or join an existing one using a team code.
        </p>
        <div className="flex gap-6 flex-col sm:flex-row">
          <button
            className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-gray-100 transition"
            onClick={() => setIsCreateModalOpen(true)} // Open the create modal
          >
            🚀 Start New Project
          </button>
          <button
            className="bg-white text-pink-600 font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-gray-100 transition"
            onClick={() => setIsJoinModalOpen(true)} // Open the join modal
          >
            🤝 Join a Project
          </button>
        </div>
      </div>

      {/* Projects Section */}
      <div className="p-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-10 mb-3 mr-3 border-indigo-500 inline-block pb-1">Active Projects</h3>

        {loading ? (
          <p>Loading...</p>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {projects
              .filter((project) => project.status !== 'completed')
              .map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
          </div>
        ) : (
          <p className="text-center mt-6">No projects found.</p>
        )}
      </div>

      {/* Join Project Modal */}
      <JoinProjectModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onProjectJoined={handleProjectJoined}
      />
      
      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  )
}

export default Home

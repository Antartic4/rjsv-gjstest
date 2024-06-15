import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/router';

const ProjectsPage: React.FC = () => {
  const { status } = useSession();
  const [projects, setProjects] = useState<any[]>([]);
  const [projectID, setProjectID] = useState<number>(1);
  const [sortBy, setSortBy] = useState<'projectId' | 'createdAt' | 'updatedAt'>(
    'projectId'
  );
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchProjects = async () => {
        try {
          const response = await fetch('/api/projects');
          if (response.ok) {
            let data = await response.json();
            data = sortProjects(data, sortBy);
            setProjects(data);
            const usedProjectIDs: Set<number> = new Set(
              data.map((project: { projectID: number }) => project.projectID)
            );
            let lowestUnusedID: number = 1;
            while (usedProjectIDs.has(lowestUnusedID)) {
              lowestUnusedID++;
            }
            setProjectID(lowestUnusedID);
          } else {
            console.error('Failed to fetch projects:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };
      fetchProjects();
    } else if (status === 'unauthenticated') {
      signIn();
    }
  }, [sortBy, status]);

  const sortProjects = (
    projects: any[],
    sortBy: 'projectId' | 'createdAt' | 'updatedAt'
  ) => {
    return projects.slice().sort((a, b) => {
      if (sortBy === 'projectId') {
        return a.projectID - b.projectID;
      } else if (sortBy === 'createdAt') {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortBy === 'updatedAt') {
        return (
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      }
      return 0;
    });
  };

  const createProject = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectID,
        }),
      });
      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject]);
        const projectUrl = `/editor/${newProject.id}`;
        router.push(projectUrl);
      } else {
        console.error('Failed to create project:', response.statusText);
        alert('The Project ID already exists.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/screens/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedProjects = projects.filter((project) => project.id !== id);
        setProjects(updatedProjects);
      } else {
        console.error('Failed to delete project:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'authenticated') {
    return (
      <div>
        <NavBar />
        <div className="pt-5">
          <div className="flex justify-center">
            <h1 className="text-3xl md:text-5xl font-bold text-blue-800">
              RJSV - GrapesJS (trial)
            </h1>
          </div>
          <div className="flex justify-center pt-5">
            <h2 className="text-xl md:text-3xl font-bold text-blue-500">
              Create New Project
            </h2>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-5 md:gap-20 pt-5">
            <div className="flex flex-col items-center">
              <label className="text-lg md:text-xl font-semibold text-blue-700 mb-2">
                Project ID:
              </label>
              <input
                type="number"
                value={projectID}
                onChange={(e) => setProjectID(Number(e.target.value))}
                className="p-2 border-2 border-blue-500 rounded-lg text-center"
              />
            </div>
            <div>
              <button
                className="bg-blue-800 p-2 mt-6 rounded-3xl text-white font-bold text-xl md:text-2xl"
                onClick={createProject}
              >
                Create Project
              </button>
            </div>
          </div>
          <div className="flex justify-center pt-10">
            <h2 className="text-xl md:text-3xl font-bold text-blue-500">
              Project List
            </h2>
          </div>
          <div className="grid mx-[5%] xl:mx-[25%] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-5">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center"
                >
                  <Link href={`/editor/${project.id}`}>
                    <span className="text-blue-800 font-semibold hover:underline">
                      Edit Project ID: {project.projectID}
                    </span>
                  </Link>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No projects found.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProjectsPage;

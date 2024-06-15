import React, { useEffect, useState } from 'react';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs, { Components, Editor } from 'grapesjs';
import websitePlugin from 'grapesjs-preset-webpage';
import basicBlockPlugin from 'grapesjs-blocks-basic';
import formPlugin from 'grapesjs-plugin-forms';
import { useRouter } from 'next/router';

interface ScreenEditorProps {
  projectID: string;
}

// GrapesJS Editor Interface according to the docs (only used the ones i'd need)
interface GrapesJSEditor {
  getComponents(): Components;
  getStyle(): any;
  setComponents(components: object[] | any | string, opt?: any): any;
  setStyle(style: object[] | any | string): Editor;
  destroy(): void;
}

const ScreenEditor: React.FC<ScreenEditorProps> = ({ projectID }) => {
  const [editor, setEditor] = useState<GrapesJSEditor | null>(null);

  const router = useRouter();

  useEffect(() => {
    const editorInstance = grapesjs.init({
      container: '#default-container',
      width: '100%',
      height: '100vh',
      plugins: [websitePlugin, basicBlockPlugin, formPlugin],
      storageManager: {
        type: 'remote',
        stepsBeforeSave: 1,
        options: {
          remote: {
            urlLoad: `/api/screens/${projectID}`,
            urlStore: `/api/screens/${projectID}`,
            headers: { 'Content-Type': 'application/json' },
            contentTypeJson: true,
            credentials: 'same-origin',
            onLoad: (result) => result.data,
          },
        },
      },
    });

    setEditor(editorInstance);

    const loadProjectData = async () => {
      try {
        const response = await fetch(`/api/screens/${projectID}`);
        if (response.ok) {
          const { screen } = await response.json();
          editorInstance.setComponents(screen.components || '');
          editorInstance.setStyle(screen.styles || '');
        } else {
          console.error('Failed to load project data:', response.statusText);
        }
      } catch (error) {
        console.error('Error loading project data:', error);
      }
    };

    loadProjectData();

    return () => {
      editorInstance.destroy();
    };
  }, [projectID]);

  const saveProject = async () => {
    if (editor) {
      try {
        const data = {
          components: editor.getComponents(),
          styles: editor.getStyle(),
        };

        const response = await fetch(`/api/screens/${projectID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
        });

        if (response.ok) {
          console.log('Project saved successfully.');
          alert('Project saved successfully.');
        } else {
          console.error('Failed to save project:', response.statusText);
          alert('Project not saved.');
        }
      } catch (error) {
        console.error('Error saving project:', error);
        alert('Error saving project.');
      }
    }
  };

  const handleBackToProjects = () => {
    router.push('/projects');
  };

  return (
    <div className="">
      <div className="flex justify-evenly items-center py-2 ">
        <button
          className="bg-blue-800 text-white p-3 rounded-lg"
          onClick={handleBackToProjects}
        >
          Back to Projects
        </button>
        <button
          className="bg-green-700 text-white p-3 rounded-lg"
          onClick={saveProject}
        >
          Save Project
        </button>
      </div>
      <div id="default-container"></div>
    </div>
  );
};

export default ScreenEditor;

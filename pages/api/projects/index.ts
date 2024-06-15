import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { projectID } = req.body;

      const existingProject = await prisma.screen.findUnique({
        where: {
          projectID: Number(projectID),
        },
      });

      if (existingProject) {
        return res.status(400).json({ error: 'Project ID already exists!' });
      }
      const defaultConfig = {
        assets: [],
        styles: [],
        pages: [
          {
            frames: [
              {
                component: {
                  type: 'wrapper',
                  stylable: [
                    'background',
                    'background-color',
                    'background-image',
                    'background-repeat',
                    'background-attachment',
                    'background-position',
                    'background-size',
                  ],
                },
                id: 'avfRq4SBw4hOuHJk',
              },
            ],
            type: 'main',
            id: 'MXCm1clIz1rtOjSl',
          },
        ],
      };

      const newProject = await prisma.screen.create({
        data: {
          projectID: Number(projectID),
          data: defaultConfig,
        },
      });
      res.status(201).json(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  } else if (req.method === 'GET') {
    // Get all projects
    console.log();
    try {
      const projects = await prisma.screen.findMany();
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error retrieving projects:', error);
      res.status(500).json({ error: 'Failed to retrieve projects' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

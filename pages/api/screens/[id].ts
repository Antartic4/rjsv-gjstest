import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const screen = await prisma.screen.findUnique({
        where: { id: id as string },
      });
      if (screen) {
        const screenData = screen.data;
        res.status(200).json(screenData);
      } else {
        res.status(404).json({ success: false, message: 'Screen not found' });
      }
    } catch (error) {
      console.error('Error retrieving screen:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch screen' });
    }
  } else if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const { data } = req.body;
      const updatedScreen = await prisma.screen.update({
        where: { id: id as string },
        data: { data },
      });

      res.status(200).json({ success: true, screen: updatedScreen });
    } catch (error) {
      console.error('Error updating screen:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to update screen' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedScreen = await prisma.screen.delete({
        where: { id: id as string },
      });
      res.status(200).json({ success: true, deletedScreen });
    } catch (error) {
      console.error('Error deleting screen:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to delete screen' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

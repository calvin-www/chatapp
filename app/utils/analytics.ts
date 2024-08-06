import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const logConversation = async (data: {
  topic: string;
  length: number;
  solution: boolean;
  userId: string;
}) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      ...data,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error logging analytics:', error);
  }
};
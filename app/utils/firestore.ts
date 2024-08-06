import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';

export const createConversation = async (userId: string) => {
  try {
    const docRef = await addDoc(collection(db, 'conversations'), {
      userId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
};

export const saveMessage = async (conversationId: string, message: any) => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      messages: [...(await getMessages(conversationId)), message],
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const getMessages = async (conversationId: string) => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);
    if (conversationSnap.exists()) {
      return conversationSnap.data()?.messages || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

export const getUserConversations = async (userId: string) => {
  try {
    const q = query(collection(db, 'conversations'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user conversations:', error);
    throw error;
  }
};
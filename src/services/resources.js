import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

export async function getResources() {
  const q = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

export async function addResource(resourceData, userId) {
  const docRef = await addDoc(collection(db, 'resources'), {
    name: resourceData.name.trim(),
    description: resourceData.description?.trim() || '',
    type: resourceData.type || 'machine', // 'machine' | 'space'
    location: resourceData.location?.trim() || 'Makerspace Lab',
    status: resourceData.status || 'active', // 'active' | 'inactive'
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateResource(id, updateData) {
  const docRef = doc(db, 'resources', id);
  await updateDoc(docRef, {
    ...updateData,
    updatedAt: serverTimestamp()
  });
}

export async function toggleResourceStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  const docRef = doc(db, 'resources', id);
  await updateDoc(docRef, {
    status: newStatus,
    updatedAt: serverTimestamp()
  });
  return newStatus;
}

export async function deleteResource(id) {
  const docRef = doc(db, 'resources', id);
  await deleteDoc(docRef);
}

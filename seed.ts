import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const blueprint = JSON.parse(fs.readFileSync('./firebase-blueprint.json', 'utf8'));

async function seed() {
  console.log('Seeding...');
  for (const collection of blueprint.collections) {
    for (const item of collection.seed_data) {
      const docRef = doc(db, collection.collection_name, item.document_id);
      const data = { ...item };
      delete data.document_id;
      await setDoc(docRef, data);
      console.log(`Seeded ${collection.collection_name}/${item.document_id}`);
    }
  }
  console.log('Done!');
  process.exit(0);
}

seed();

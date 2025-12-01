import { app, auth, db } from './config';
import { FirebaseClientProvider } from './client-provider';
import { useUser } from './auth/use-user';
import { useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';

// Note: `useCollection` and `useDoc` are not included as they are not created yet.
// You can add them here once you create the files.

export {
  app,
  auth,
  db,
  FirebaseClientProvider,
  useUser,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};

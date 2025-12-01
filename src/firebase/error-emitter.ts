import { EventEmitter } from 'events';

// A simple event emitter to allow different parts of the app to communicate
// without being directly coupled. We will use this to broadcast Firestore
// permission errors from our data services to a central listener.
export const errorEmitter = new EventEmitter();

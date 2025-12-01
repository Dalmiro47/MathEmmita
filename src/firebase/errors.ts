export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

// A custom error class for Firestore permission errors.
// This allows us to capture rich context about the operation that failed.
export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const detailedMessage = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify({ ...context }, null, 2)}`;
    super(detailedMessage);
    this.name = 'FirestorePermissionError';
    this.context = context;
    
    // This is necessary for extending a built-in class like Error
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}

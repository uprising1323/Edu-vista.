import { BACKENDLESS_APP_ID, BACKENDLESS_API_KEY, firebaseConfig, ROLES } from './config.js';

// Initialize Backendless
Backendless.initApp(BACKENDLESS_APP_ID, BACKENDLESS_API_KEY);

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

class AuthService {
  constructor() {
    this.currentUser = null;
    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    this.setupAuthStateListener();
  }

  // Setup authentication state listener
  setupAuthStateListener() {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in
        this.currentUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
        
        // Check if user exists in Backendless, if not create
        await this.syncUserWithBackendless(user);
        
        // Redirect to dashboard or previous page
        const returnUrl = localStorage.getItem('returnUrl') || 'dashboard.html';
        window.location.href = returnUrl;
      } else {
        // User is signed out
        this.currentUser = null;
      }
    });
  }

  // Sync Firebase user with Backendless
  async syncUserWithBackendless(firebaseUser) {
    try {
      // First, try to log in with Firebase token
      const token = await firebaseUser.getIdToken();
      
      // This is a simplified example - you'll need to implement the actual Backendless user sync
      // based on your Backendless setup
      const userData = {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        firebaseUid: firebaseUser.uid,
        role: ROLES.STUDENT // Default role
      };
      
      // Here you would typically make an API call to your Backendless backend
      // to create/update the user
      console.log('Syncing user with Backendless:', userData);
      
    } catch (error) {
      console.error('Error syncing user with Backendless:', error);
      throw error;
    }
  }

  // Email/Password Sign Up
  async signUp(email, password, userData) {
    try {
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({
        displayName: userData.name
      });
      
      // Save additional user data to Firestore
      await this.db.collection('users').doc(userCredential.user.uid).set({
        ...userData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      return userCredential.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Email/Password Login
  async login(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Google Sign In
  async signInWithGoogle() {
    try {
      const result = await this.auth.signInWithPopup(this.googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  }

  // Sign Out
  async signOut() {
    try {
      await this.auth.signOut();
      // Clear any stored user data
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Password Reset
  async resetPassword(email) {
    try {
      await this.auth.sendPasswordResetEmail(email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }
}

// Create and export a singleton instance
export const authService = new AuthService();

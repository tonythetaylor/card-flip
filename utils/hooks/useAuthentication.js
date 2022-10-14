import {useState, useEffect} from 'react';
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db, database, getMessages } from '../../firebase';

const auth1 = getAuth();

const useAuthentication = () => {
  const [user, setUser] = useState(auth1.currentUser);

  useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth1, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
      } else {
        // User is signed out
        setUser(undefined);
      }
    });

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return {
    user
  };
}

const signOutNow = () => {
  
  signOut(auth).then(() => {
    // Sign-out successful.
    navigation.replace('Login');
  }).catch((error) => {
    // An error happened.
  });
}

export { signOutNow, useAuthentication}
// import firebase from "../firebase";
import { db, database} from '../firebase';

import { ref, onValue, set} from "firebase/database";

const _db =  ref(database, 'relationships/');

const initialState = {
    id: '',
    text: '',
    uri: ''
};

const getAll = () => {
    // let d = [] 
    const d = onValue(_db, (snapshot) => {
        let allData = []
        snapshot.forEach(snap => {
            allData.push(snap.val());
          });
          return allData
        // const jokesData = snapshot.val();
        // if (jokesData) {
        //     //   console.log('EXISTS:  ', jokesData)
        //     _d.push(jokesData)
        // }
        // return _d
            //   setData(jokesData)
        });
  return d;
};

const create = (data) => {
  return _db.push(data);
};
const update = (key, data) => {
  return _db.child(key).update(data);
};
const remove = (key) => {
  return _db.child(key).remove();
};
const removeAll = () => {
  return _db.remove();
};

export default {
  getAll,
  create,
  update,
  remove,
  removeAll,
};
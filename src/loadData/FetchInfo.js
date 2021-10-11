import { db, auth } from "../firebase";
import firebase from "firebase";

export async function doesUserExist(emailId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("emailAddress", "==", emailId)
    .get();

  return result.docs.map((user) => user.data().length > 0);
}

export async function getActiveUser(userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId);

  const activeUser = await result.onSnapshot((snapshot) => {
    snapshot.docs.map((doc) => ({
      ...doc.data(),
      docId: doc.id,
    }));
  });

  // const activeUser = result.docs.map((item) => ({
  //   ...item.data(),
  //   docId: item.id,
  // }));
  // console.log(await activeUser);
  return await activeUser;
}

export async function getAllChatItem(chatfriends) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "in", chatfriends)
    .get();

  const chatFriends = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
  return chatFriends;
}

export async function groupDetailById(groupId) {
  const result = await firebase.firestore().collection("Chat").doc(groupId);
  return await result;
}

// export async function getAllGroup(chatfriends) {
//   const result = await firebase
//     .firestore()
//     .collection("Chat")
//     .where("userId", "in", chatfriends)
//     .get();

//   const chatFriends = result.docs.map((item) => ({
//     ...item.data(),
//     docId: item.id,
//   }));
//   return chatFriends;
// }

export async function getSearchedUser(info) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("emailAddress", "==", info)
    .get();

  const activeUser = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
  return activeUser;
}

export const getSearchedGroup = async (info) => {
  const result = await firebase
    .firestore()
    .collection("Chat")
    .where("groupName", "==", info);

  // await result.onSnapshot((snapshot) => {
  //   snapshot.docs.map((doc) => ({
  //     ...doc.data(),
  //     docId: doc.id,
  //   }));
  // });
  // console.log('ok', searchedGroup)

  // console.log('ok',searchedGroup)

  //  const groups = result.docs.map((item) => ({
  //    ...item.data(),
  //    docId: item.id,
  //  }));
  return await result;
};

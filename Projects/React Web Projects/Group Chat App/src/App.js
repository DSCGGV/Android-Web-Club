import React, { useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import logo from "./logoplane.png"; 
import send from "./send-mail.png"; 

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  //Firebase SDK snippet Config
  //Not included here in Public Repo
})

const auth = firebase.auth();  //Global Variables
const firestore =firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      <div className="container bg-warning mb-5 fixed-top">
        <div className="d-flex bd-highlight align-items-center">
          <div className="p-2"><img src={logo} class="rounded-circle" alt="DSC Logo"/></div>
          <div className="p-2 flex-fill"><h3>DSC GGV Group Chat</h3></div>
          <SignOut />
        </div>
      </div>
      </header>

      <section className="py-5 mt-5">
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>

  );
}

function SignIn(){

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className="container d-flex p-5 text-center">
      <div className="jumbotron border border-warning bg-transparent text-white">
        <h1 className="display-4">Hello, world!</h1>
        <p className="lead">This is a dummy of Chat Group where all participants can send message directly. Identity of participants is confirmed by loging with google account. React.js and Bootstrap were used for frontend while backend is handled by firebase</p>
        <hr className="my-4 border-warning"/>
        <p>Made With <span role="img" aria-label="love">❤️</span> by Amogh</p>
        <button type="button" className="btn btn-success btn-lg btn-block mx-auto" onClick={signInWithGoogle}>Sign In with Google</button>
      </div>
  </div>
  )
}

function SignOut() {
  return auth.currentUser && (
    <div className="p-2"><button type="button" class="btn btn-outline-danger" onClick={() => auth.signOut()}>Sign Out</button></div>
  )
}

function ChatRoom () {

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behaviour: 'smooth' });
  }

  return (
    <div>
      <main>
      <div class="container text-light px-5 pb-5">
        {messages && messages.map(msg => 
          <ChatMessage key={msg.id} message={msg} />
          )
        }
        <div ref={dummy}></div>
        </div>
      </main>

    <div className="container border border-warning fixed-bottom" style={{background: "black"}}>
      <form onSubmit={sendMessage}>
        <div className="d-flex bd-highlight">
          <div className="p-2 flex-fill bd-highlight m-auto">
            <input value={formValue} class="form-control rounded-pill" onChange={(e) => setFormValue(e.target.value)} />
          </div>
          <button type='submit' class="btn border border-warning m-2" disabled={!formValue}>
            <img src={send} alt="Send" style={{maxHeight: "4vh"}}/> 
          </button>
        </div>
      </form>
    </div>

      {/*Icons made by <a href="https://www.flaticon.com/authors/freepik"*/}

    </div>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  if (uid !== auth.currentUser.uid) {
    return(
        <div className="d-flex mb-3 flex-row">
          <div class="p-2">
            <img src={photoURL} class="rounded-circle" alt="User DP" style={{maxHeight: "8vh"}}/>
          </div>
          <div class="p-2 m-auto rounded border border-light">
            {text}
          </div>
          <div class="p-2 flex-grow-1"></div>
        </div>
    )
  } else {
    return(
      <div className="d-flex flex-row-reverse">
        <div class="p-2">
          <img src={photoURL} class="rounded-circle" alt="User DP" style={{maxHeight: "8vh"}}/>
        </div>
        <div class="p-2 m-auto rounded border border-primary">
          {text}
        </div>
        <div class="p-2 flex-grow-1"></div>
      </div>
    )
  }
}

export default App;

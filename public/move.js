import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS7GV0PQ5ycTmE_fj_yF5n7QyYtWVGhtM",
  authDomain: "cosyncwebapp.firebaseapp.com",
  databaseURL: "https://cosyncwebapp-default-rtdb.firebaseio.com",
  projectId: "cosyncwebapp",
  storageBucket: "cosyncwebapp.appspot.com",
  messagingSenderId: "917238852465",
  appId: "1:917238852465:web:67c2a31b00c63fe9e0a4d0",
  measurementId: "G-6EVZVM81TM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const circleRef = ref(db, 'circle/');

const myid = Math.random().toString(32).substring(2);

const circle = document.getElementById('circle');
draggable(circle);

// 初期位置の指定
get(circleRef).then((snapshot) => {
    if (snapshot.exists()) {
        const val = snapshot.val();
        circle.style.left = val.x + 'px';
        circle.style.top = val.y + 'px';
        circle.style.display = 'block';
    } else {
        circle.style.left = '0px';
        circle.style.top = '0px';
        circle.style.display = 'block';
    }
}).catch((error) => {
    console.error(error);
});

// 別ブラウザで座標が変更されたら本ブラウザに反映する
onValue(circleRef, (snapshot) => {
    const val = snapshot.val();
    if (val.update_by === myid)
        return;
    circle.style.left = val.x;
    circle.style.top = val.y;
});

function draggable(target) {
    target.onmousedown = function() {
        target.shiftX = event.clientX - target.getBoundingClientRect().left;
        target.shiftY = event.clientY - target.getBoundingClientRect().top;
        document.onmousemove = mouseMove;
    };
    document.onmouseup = function() {
        document.onmousemove = null;
        target.shiftX = null;
        target.shiftY = null;
    };
    function mouseMove(event) {
        target.style.left = event.clientX - target.shiftX + 'px';
        target.style.top = event.clientY - target.shiftY + 'px';
        set(circleRef, {
            x: event.clientX - target.shiftX,
            y: event.clientY - target.shiftY,
            update_by: myid
        });
    }
}
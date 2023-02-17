firebase.initializeApp({
    apiKey: "AIzaSyCUL49ocqCYHOBY6foG4vo4mGrIesmmADo",
    authDomain: "bicicletas-vallin.firebaseapp.com",
    projectId: "bicicletas-vallin",
    storageBucket: "bicicletas-vallin.appspot.com",
    messagingSenderId: "335129691966",
    appId: "1:335129691966:web:44c162150aa5eda21f4e6f",
    measurementId: "G-VRY8DTTJVV"
});
var db = firebase.firestore();
var storageRef = firebase.storage();
//const analytics = firebase.analytics();
function login(){
    let email = $("#email").val();
    let password=$("#password").val();
    if(email!=null && password!=null){
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            sessionStorage.setItem("user",user.uid);
            document.getElementById('login_inputs').style.display='none';
            document.getElementById('logOutBtn').style.display='';
            document.getElementById('content').style.display='';
        })
        .catch((error) => {
            console.log(error.code,error.message);
        });
    }
}
function logOut(){
    firebase.auth().signOut().then(() => {
        //window.location.reload();
        sessionStorage.removeItem("user");
        window.location.reload();
    }).catch((error) => {
        //console.log(error.message);
    });
}
function guardar(cotizacion){
    db.collection('cotizaciones').add(cotizacion).then((result)=>{
        alert('Cotizacion guardada');
    }).catch((result)=>{
        console.log(error.message);
    });
}

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
const auth = firebase.auth();
firebase.auth().onAuthStateChanged((user) => {
if (user) {
    //var uid = user.uid;
} else {
    sessionStorage.removeItem("user");
    window.location.reload();
}
});
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
    console.log('llega aqui');
    db.collection('cotizaciones').add(cotizacion).then((result)=>{
        alert('Cotizacion guardada');
    }).catch((error)=>{
        console.log(error.message);
    });
}
function cargarCotizaciones(){
    let cotizaciones = document.getElementById('cotizaciones');
    console.log('llega');
    db.collection('cotizaciones').onSnapshot((result)=>{
        result.forEach((doc) => {
            cotizaciones.innerHTML+=`<tr>
            <th scope="row">${doc.data().folio_req}</th>
            <td>${doc.data().nombre}</td>
            <td>${doc.data().forma_pago}</td>
            <td>${doc.data().fecha}</td>
            <td>${doc.data().total}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <p class="btn btn-warning" onclick="modalEditar(${doc.id})">Editar</p>
                    <p class="btn btn-danger" onclick="eliminarCot(${doc.id})">Eliminar</p>
                </div>
            </td>
        </tr>`;
        });
    });
}

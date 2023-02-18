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
    db.collection('cotizaciones').add(cotizacion).then((result)=>{
        $("#exampleModal").modal('hide');
        alert('Cotizacion guardada');
    }).catch((error)=>{
        console.log(error.message);
    });
}
function actualizarCot(cot_id,cotizacion){
    db.collection('cotizaciones').doc(cot_id).update(cotizacion).then((result)=>{
        $("#exampleModal").modal('hide');
        alert('Cotizacion actualizada');
    }).catch((error)=>{
        console.log(error.message);
    });
}
function cargarCotizaciones(){
    let cotizaciones = document.getElementById('cotizaciones');
    db.collection('cotizaciones').onSnapshot((result)=>{
        cotizaciones.innerHTML='';
        result.forEach((doc) => {
            cotizaciones.innerHTML+=`<tr>
            <td>${doc.data().folio_req}</td>
            <td>${doc.data().cliente}</td>
            <td>${doc.data().forma_pago}</td>
            <td>${doc.data().fecha}</td>
            <td>${doc.data().total}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <p class="btn btn-warning" onclick="editarCot('${doc.id}')">Editar</p>
                    <p class="btn btn-danger" onclick="eliminarCot('${doc.id}')">Eliminar</p>
                </div>
            </td>
        </tr>`;
        });
        $('#cotizaciones_table').DataTable();
    });
}
function editarCot(cot_id){
    document.getElementById('tbody').innerHTML='';
    db.collection('cotizaciones').doc(cot_id).get().then((doc)=>{
        let cotizacion = doc.data();
        let products = doc.data().productos;
        $("#cotizacion").val(doc.id);
        $("#folio_req").val(cotizacion.folio_req);
        $("#cliente").val(cotizacion.cliente);
        $("#forma_pago").val(cotizacion.forma_pago);
        $("#fecha").val(cotizacion.fecha);
        $("#ciudad").val(cotizacion.ciudad);

        products.forEach((product,index)=>{
            if(index==products.length-1){
                $("#tbody").append(`<tr id="row-${index}-" class="fila">
                <td><input type="number" style="width: 100%;text-align: center;" id="cantidad-${index}-" placeholder="0" onchange="calcular(${index})" onkeyup="calcular(${index})" value="${product.cantidad}"/></td>
                <td><input type="text" style="width: 100%;" id="desc-${index}-" placeholder="Descripción" onchange="calcular(${index})" onkeyup="calcular(${index})" value="${product.desc}"/></td>
                <td><input type="number" style="width: 100%;text-align: center;" id="precio-${index}-" placeholder="0" onchange="calcular(${index})" onkeyup="calcular(${index})" value="${product.precio}"/></td>
                <td><input type="number" style="width: 100%;text-align: center;border: 0;" id="total-${index}-" placeholder="0" value="${product.total}" readonly/></td>
                <td>
                    <p class="btn btn-danger" id="delBTN-${index}-" onclick="delRow(${index})">
                        <i class="fas fa-trash"></i>
                    </p>
                </td>
                </tr><tr id="row-${index+1}-" class="fila">
                    <td><input type="number" style="width: 100%;text-align: center;" id="cantidad-${index+1}-" placeholder="0" onchange="calcular(${index+1})" onkeyup="calcular(${index+1})" value="0"/></td>
                    <td><input type="text" style="width: 100%;" id="desc-${index+1}-" placeholder="Descripción" onchange="calcular(${index+1})" onkeyup="calcular(${index+1})"/></td>
                    <td><input type="number" style="width: 100%;text-align: center;" id="precio-${index+1}-" placeholder="0" onchange="calcular(${index+1})" onkeyup="calcular(${index+1})" value="0"/></td>
                    <td><input type="number" style="width: 100%;text-align: center;border: 0;" id="total-${index+1}-" placeholder="0" value="0" readonly/></td>
                    <td>
                        <p class="btn btn-danger" style="display:none;" id="delBTN-${index+1}-" onclick="delRow(${index+1})">
                            <i class="fas fa-trash"></i>
                        </p>
                    </td>
                </tr>`);
            }else if(index<products.length){
                $("#tbody").append(`<tr id="row-${index}-" class="fila">
                <td><input type="number" style="width: 100%;text-align: center;" id="cantidad-${index}-" placeholder="0" onchange="calcular(${index})" onkeyup="calcular(${index})" value="${product.cantidad}"/></td>
                <td><input type="text" style="width: 100%;" id="desc-${index}-" placeholder="Descripción" onchange="calcular(${index})" onkeyup="calcular(${index})" value="${product.desc}"/></td>
                <td><input type="number" style="width: 100%;text-align: center;" id="precio-${index}-" placeholder="0" onchange="calcular(${index})" onkeyup="calcular(${index})" value="${product.precio}"/></td>
                <td><input type="number" style="width: 100%;text-align: center;border: 0;" id="total-${index}-" placeholder="0" value="${product.total}" readonly/></td>
                <td>
                    <p class="btn btn-danger" id="delBTN-${index}-" onclick="delRow(${index})">
                        <i class="fas fa-trash"></i>
                    </p>
                </td>
            </tr>`);
            }
        });

        $("#subtotal").val(cotizacion.subtotal);
        $("#iva").val(cotizacion.iva);
        $("#total").val(cotizacion.total);
        $("#exampleModal").modal('show');
    }).catch((error)=>{
        console.log(error.message);
    });
}
function eliminarCot(cot_id){
    let a = confirm('¿Desea eliminar esta cotización?');
    if(a){
        db.collection('cotizaciones').doc(cot_id).delete().then((resutl)=>{
            //cargarCotizaciones();
        }).catch((error)=>{
            consolole.log(error.message);
        });
    }
}

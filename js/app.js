$( document ).ready(function() {
    let user = sessionStorage.getItem("user");
    if(user==null){
        document.getElementById('content').style.display='none';
    }else{
        document.getElementById('login_inputs').style.display='none';
        document.getElementById('logOutBtn').style.display='';
        cargarCotizaciones()
    }
    $("#exampleModal").on('hide.bs.modal', function(){
        $("#formulario_cotizacion").trigger('reset');
        document.getElementById('tbody').innerHTML='';
        $("#tbody").append(`<tr id="row-0-" class="fila">
        <th scope="row"><input type="number" style="width: 100%;text-align: center;" id="cantidad-0-" placeholder="0" onchange="calcular(0)" onkeyup="calcular(0)" value="0"/></th>
        <td><input type="text" style="width: 100%;" id="desc-0-" placeholder="Descripción" onchange="calcular(0)" onkeyup="calcular(0)"/></td>
        <td><input type="number" style="width: 100%;text-align: center;" id="precio-0-" placeholder="0" onchange="calcular(0)" onkeyup="calcular(0)" value="0"/></td>
        <td><input type="number" style="width: 100%;text-align: center;border: 0;" id="total-0-" placeholder="0" readonly/></td>
        <td>
            <p class="btn btn-danger" style="display: none;" id="delBTN-0-" onclick="delRow(0)">
                <i class="fas fa-trash"></i>
            </p>
        </td>
    </tr>`);
    });
});
function delRow (id){
    let contenedor = document.getElementById("tbody");
    let element = document.getElementById("row-"+id+"-");
    let products = $("#tbody .fila").toArray();
    contenedor.removeChild(element);
    for (let i = id; i < products.length; i++) {
        $("#row-"+(i+1)+"-").attr("id","row-"+i+"-");
        $("#cantidad-"+(i+1)+"-").attr("onchange","calcular("+i+")");
        $("#cantidad-"+(i+1)+"-").attr("onkeyup","calcular("+i+")");
        $("#cantidad-"+(i+1)+"-").attr("id","cantidad-"+i+"-");
        $("#desc-"+(i+1)+"-").attr("id","desc-"+i+"-");
        $("#desc-"+(i+1)+"-").attr("onkeyup","calcular("+i+")");
        $("#precio-"+(i+1)+"-").attr("onchange","calcular("+i+")");
        $("#precio-"+(i+1)+"-").attr("onkeyup","calcular("+i+")");
        $("#precio-"+(i+1)+"-").attr("id","precio-"+i+"-");
        $("#total-"+(i+1)+"-").attr("id","total-"+i+"-");
        $("#delBTN-"+(i+1)+"-").attr("onclick","delRow("+i+")");
        $("#delBTN-"+(i+1)+"-").attr("id","delBTN-"+i+"-");
        if(i=products.length-1){
            if(document.getElementById("delBTN-"+i+"-")){
                document.getElementById("delBTN-"+i+"-").style.display='none';
            }
        }
    }
    calcularTotal();
}
function calcular(id,oper){
    var cantidad = $("#cantidad-"+id+'-').val();
    var precio = $("#precio-"+id+"-").val();
    var total = cantidad*precio;
    var desc = $("#desc-"+id+"-").val();
    $("#total-"+id+"-").val(total);
    var products= $("#tbody .fila").toArray();
    calcularTotal();
    if(total>0){
        if(desc!=''){
            if((id+1)==products.length){
                if(document.getElementById("delBTN-"+id+"-")){
                    document.getElementById("delBTN-"+id+"-").style.display='';
                }
                $("#tbody").append(`<tr id="row-${id+1}-" class="fila">
                    <th scope="row"><input type="number" style="width: 100%;text-align: center;" id="cantidad-${id+1}-" placeholder="0" onchange="calcular(${id+1})" onkeyup="calcular(${id+1})" value="0"/></th>
                    <td><input type="text" style="width: 100%;" id="desc-${id+1}-" placeholder="Descripción" onchange="calcular(${id+1})" onkeyup="calcular(${id+1})"/></td>
                    <td><input type="number" style="width: 100%;text-align: center;" id="precio-${id+1}-" placeholder="0" onchange="calcular(${id+1})" onkeyup="calcular(${id+1})" value="0"/></td>
                    <td><input type="number" style="width: 100%;text-align: center;border: 0;" id="total-${id+1}-" placeholder="0" value="0" readonly/></td>
                    <td>
                        <p class="btn btn-danger" style="display: none;" id="delBTN-${id+1}-" onclick="delRow(${id+1})">
                            <i class="fas fa-trash"></i>
                        </p>
                    </td>
                </tr>`);
            }
        }
    } 
}
function calcularTotal(){
    let products = $("#tbody .fila").toArray();
    var subtotal =0;
    var iva=0;
    for (let i = 0; i < products.length; i++) {
        subtotal +=(document.getElementById("total-"+i+"-").value)*1;
        $("#subtotal").val(subtotal);
        iva = (subtotal*16)/100;
        $("#iva").val(iva);
        $("#total").val(subtotal+iva);
    }
}
function format_data(){
    let id = $("#cotizacion").val();
    var elements= $("#tbody .fila").toArray();
    let products =[];
    for (let i = 0; i < elements.length; i++) {
        if($("#total-"+i+"-").val()>0){
            products.push({
                cantidad:$("#cantidad-"+i+"-").val(),
                desc:$("#desc-"+i+"-").val(),
                precio:$("#precio-"+i+"-").val(),
                total:$("#total-"+i+"-").val()
            });
        }
    }
    let cotizacion ={
        folio_req:$("#folio_req").val(),
        cliente:$("#cliente").val(),
        forma_pago:$("#forma_pago").val(),
        fecha:$("#fecha").val(),
        ciudad:$("#ciudad").val(),
        productos:products,
        subtotal:$("#subtotal").val(),
        iva:$("#iva").val(),
        total:$("#total").val()
    }
    if(cotizacion.total>0){
        //console.log(cotizacion);
        if(id!=''){
            actualizarCot(id,cotizacion);
        }else{
            guardar(cotizacion);
        }
    }
}
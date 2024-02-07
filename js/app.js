const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}


//FUnción que crea un promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () =>{
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptoSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
        .then(respuesta => respuesta.json())
        .then( resultado => obtenerCriptomonedas(resultado.Data))
        .then( criptomonedas => /*1*/selectCriptomonedas(criptomonedas))
}

/*1*/function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptoSelect.appendChild(option);
    })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    //Validar

    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === '') {
        /*2*/mostrarALerta('Ambos campos son obligatorios');
        return;
    }
    //consultar API

    /*3*/consultarAPI();
}

/*2*/function mostrarALerta(msg){

    const existeError = document.querySelector('.error');

    if(!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.innerText = msg;
        divMensaje.classList.add('error');
        formulario.appendChild(divMensaje);
        
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

/*3*/ function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( cotizacion => {
            mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]);
        });
}

function mostrarCotizacion(cotizacion) {
    limpiarHTML();
    const {PRICE, CHANGEDAY, CHANGEHOUR, LASTUPDATE, LOWDAY, HIGHDAY} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `<p>Precio: <span>${PRICE}</span></p>`;

    const varDia = document.createElement('p');
    varDia.innerHTML = `<p>Variación día: ${CHANGEDAY}</p>`;

    const varHora = document.createElement('p');
    varHora.innerHTML = `<p>Variación hora: ${CHANGEHOUR}</p>`;

    const actualizado = document.createElement('p');
    actualizado.innerHTML = `<p>Última actualización: ${LASTUPDATE}</p>`;

    const bajo = document.createElement('p');
    bajo.innerHTML = `<p>Precio mas bajo del día: ${LOWDAY}</p>`;

    const alto = document.createElement('p');
    alto.innerHTML = `<p>Precio mas alto del día: ${HIGHDAY}</p>`;


    resultado.appendChild(precio);
    resultado.appendChild(varDia);
    resultado.appendChild(varHora);
    resultado.appendChild(bajo);
    resultado.appendChild(alto);
    resultado.appendChild(actualizado);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
    <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
    `;
    resultado.appendChild(spinner);
}

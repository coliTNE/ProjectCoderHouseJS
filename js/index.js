
//Declaracion de Variables Principales

let planes = []

fetch('http://localhost:5501/js/planes.json')
    .then((response) => response.json())
    .then((json) => planes = planes.concat(json))

let nombre

let apellido

let pasos = -1

let dinero = 0

let int = 0

let mes = 0

let diapositivas = document.querySelectorAll(".main__content")

let mesElegido

let interesElegido

let reset = document.getElementById('reset')

// Boton Reset

reset.onclick = () => {
    Swal.fire({
        title: 'Estas seguro de volver al inicio?',
        text: "Se perderan todos tus datos!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#f58331',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, volver al inicio!',
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            let lastStep = document.getElementById("main__divBtn")
            lastStep.classList.remove("hidden")
            let planesContenedor = document.getElementById("opcionesPlan")
            planesContenedor.innerHTML = ""
            reset.classList.add("hidden")
            anteriorPaso()
        }
    })
}

// visualizacion de boton de reset

const checkReset = () => {
    if (pasos > 0) {
        reset.classList.remove("hidden")
    }
}

// Activador De Cartas

let tarjetasInteres = document.querySelector(".main__tarjetasInteres").querySelectorAll("div");

tarjetasInteres.forEach(element => {
    element.addEventListener("click", function () {
        tarjetasInteres.forEach(card => card.classList.remove("activeInt"))
        this.classList.add("activeInt")
    })
});

let tarjetasMeses = document.querySelector(".main__tarjetasMeses").querySelectorAll("div");

tarjetasMeses.forEach(element => {
    element.addEventListener("click", function () {
        tarjetasMeses.forEach(card => card.classList.remove("activeMes"))
        this.classList.add("activeMes")
    })
});


//Visibilidad de los pasos

function siguientePaso() {
    pasos++
    console.log(pasos)
    for (pagina of diapositivas) pagina.className = "hidden"
    diapositivas[pasos].className = "";
    checkReset()
}

function anteriorPaso() {
    pasos = 0
    console.log(pasos)
    for (pagina of diapositivas) pagina.className = "hidden"
    diapositivas[pasos].className = "";
    checkReset()
}

// Estructura Principal del Simulador interactivo

let btn = document.getElementById('btn')
btn.addEventListener("click", function () {
    if (pasos == 0) {
        nombre = document.getElementById('nombre').value
        apellido = document.getElementById('apellido').value
        dinero = parseFloat(document.getElementById('monto').value)

        // se declara variable para checkear localStorage

        let datosLocales = JSON.parse(localStorage.getItem('planUsuario'))
        console.log(datosLocales)

        //Validar si el usuario tiene un plan guardado anteriormente
        if (isNaN(parseFloat(dinero)) || parseFloat(dinero) < 1) {
            Swal.fire({
                title: 'Ingrese una cantidad valida de dinero',
                confirmButtonColor: '#f58331',
            })
            anteriorPaso()
        } else if (nombre === "" || apellido === "") {
            Swal.fire({
                title: 'Complete todos sus datos porfavor',
                confirmButtonColor: '#f58331',
            })
            anteriorPaso()
        } else if (datosLocales != null && nombre === datosLocales.nombre && apellido === datosLocales.apellido) {
                Swal.fire({
                    title: 'Ya tienes un plan en nuestra pagina!',
                    text: "Quieres cargarlo?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#f58331',
                    cancelButtonText: 'No, Gracias',
                    confirmButtonText: 'Si, porfavor!',
                    allowOutsideClick: false
                }).then((result) => {
    
                    // Se muestra datos de su plan
    
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: `${datosLocales.nombre} ${datosLocales.apellido}`,
                            text: ` Usted ingreso $${datosLocales.montoInicial} y generó $${datosLocales.ganancia.toFixed(1)} de ganancia !`,
                            confirmButtonColor: '#f58331',
                        })
                    } else {
                        siguientePaso()
                    }
                })
            
        } else {
            siguientePaso()
        }
    }
    else if (pasos == 1) {

        // declaracion y asignacion de cartas de Interes

        let buscarInteres = document.getElementsByClassName('activeInt');
        let interesEncontrado = buscarInteres[0].innerText.slice(0, -1);
        int = parseInt(interesEncontrado)
        console.log(int)
        siguientePaso()
    }
    else if (pasos == 2) {

        // declaracion y asignacion de cartas de Meses
        let buscarMes = document.getElementsByClassName("activeMes");
        let mesEncontrado = buscarMes[0].innerText;
        mes = parseFloat(mesEncontrado)

        console.log(mes)

        // se llama a la funcion calculadora con el plan de interes y de meses seleccionados anteriormente

        calcular()

        // se declara los planes disponibles

        let cartasPlanes = document.querySelectorAll(".main__optionCard");
        console.log(cartasPlanes)

        // se elige el plan activo

        cartasPlanes.forEach(element => {
            element.addEventListener("click", function () {
                cartasPlanes.forEach(card => card.classList.remove("activePlan"))
                this.classList.add("activePlan")

            })
        });
        siguientePaso()
    }
    else if (pasos == 3) {
        finalPlan()

        //Creacion de cuadro de texto final

        let finalMsg = document.getElementById("result")
        let finalUsuario = document.getElementById("usuario")
        const [mensaje, saldosF, localUsuario] = finalPlan()
        finalUsuario.innerHTML = `<p>Felicitaciones ${nombre} ${apellido} !</p>`
        finalMsg.appendChild(mensaje)

        //Boton para visualizar los saldos

        let saldosBtn = document.getElementById("finalSaldos")
        saldosBtn.onclick = () => {
            Swal.fire(saldosF)
        }

        //se guarda el plan con todos los datos relevantes

        localStorage.setItem('planUsuario', JSON.stringify(localUsuario))
        siguientePaso()

        //se esconde el boton principal de navegacion
        let lastStep = document.getElementById("main__divBtn")
        lastStep.className = "hidden"
    }
})

siguientePaso()

function calcular() {
    // Aca se busca planes que cumplan con alguna de las dos condiciones

    let planElegido = planes.filter((elemento) => elemento.interes == int || elemento.meses == mes)

    console.log(planElegido)

    //se crean las cartas de los planes filtrados

    let planesContenedor = document.getElementById("opcionesPlan")
    let main__optionCards = document.createElement("div")
    main__optionCards.className = "main__optionCards"
    planesContenedor.appendChild(main__optionCards);

    for ([index, planesElegidos] of planElegido.entries()) {
        let opcionPlan = document.createElement("div")
        opcionPlan.className = "main__optionCard"

        opcionPlan.innerHTML = `<h3>Plan Nro ${index + 1}</h3>
                                <div class="cardBox">
                                    <div>
                                        <p class="mesData">${planesElegidos.meses}</p>
                                        <p>meses</p>
                                    </div>
                                    <div>
                                        <p>Interes</p>
                                        <p class="intData">${planesElegidos.interes}%</p>
                                    </div>
                                </div>`
        main__optionCards.appendChild(opcionPlan);
    }
}

function finalPlan() {

    //se filtra el plan seleccionado

    findFinalMonth = document.querySelector(".activePlan .mesData")
    mesElegido = findFinalMonth.innerText
    findFinalInt = document.querySelector(".activePlan .intData")
    interesElegido = findFinalInt.innerText.slice(0, -1);

    //se calculan los saldos correspondientes al plan

    function plazoFijo(monto, interes, meses) {
        let saldos = []
        let sum = 0
        for (let i = 1; i <= meses; i++) {
            monto += interes * monto / 100
            saldos.push(monto.toFixed(1))
        }
        for (let index = 0; index < saldos.length; index++) {
            sum += parseFloat(saldos[index])
        }
        console.log(sum)
        return saldos
    }

    let saldosFinal = plazoFijo(dinero, interesElegido, mesElegido);

    //creacion de objeto con los datos relevantes

    let planFinal = {
        nombre: nombre,
        apellido: apellido,
        interes: int,
        meses: mes,
        saldos: saldosFinal,
        montoInicial: dinero,
        ganancia: saldosFinal.slice(-1)[0] - dinero
    }

    //creacion del mensaje final hacia el usuario

    let mensaje = document.createElement("div")
    mensaje.className = "main__mensajeFinal"
    mensaje.innerHTML = `<p>Su saldo Final es de $ ${planFinal.saldos.slice(-1)[0]} y Usted Genero $ ${(planFinal.saldos.slice(-1)[0] - dinero).toFixed(2)} de ganancia</p>`

    console.log(planFinal)

    //creacion de cuadro de texto con todos los saldos ordenados

    msg = ""

    for (let index = 0; index < planFinal.saldos.length; index++) {
        const element = planFinal.saldos[index];
        msg += "Mes Nro " + (index + 1) + " $ " + element + "\n"
    }

    return [mensaje, msg, planFinal]

}


//Animacion Header

document.addEventListener("scroll", function () {
    let header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0)
})
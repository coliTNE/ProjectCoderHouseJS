document.addEventListener("scroll", function(){
    let header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0)})

//Simulador de Interes Plazo Fijo

const planes = [
    {
        "meses" : 12,
        "interes" : 2,
    },
    {
        "meses" : 18,
        "interes" : 4,
    },
    {
        "meses" : 24,
        "interes" : 6,
    },
    {
        "meses" : 18,
        "interes" : 3,
    },
    {
        "meses" : 20,
        "interes" : 5,
    },
    {
        "meses" : 14,
        "interes" : 3,
    },
    {
        "meses" : 24,
        "interes" : 5,
    },
    {
        "meses" : 30,
        "interes" : 7,
    }
]

let step = -1

let dinero = 0

let int = 0
 
let month = 0

let labels = document.querySelectorAll(".main__content")

let selectedMonth

let selectedInt

console.log(labels)

let intCards = document.querySelector(".main__intCards").querySelectorAll("div");
console.log(intCards)

intCards.forEach(element => {
    element.addEventListener("click", function(){
        intCards.forEach(card=>card.classList.remove("activeInt"))
        this.classList.add("activeInt")
    })
});

let mesCards = document.querySelector(".main__mesCards").querySelectorAll("div");
console.log(mesCards)

mesCards.forEach(element => {
    element.addEventListener("click", function(){
        mesCards.forEach(card=>card.classList.remove("activeMes"))
        this.classList.add("activeMes")
    })
});

function showNextStep(){
    step++
    console.log(step)
    for (label of labels) label.className = "hidden"
    labels[step].className = "";
}

let btn = document.getElementById('btn')
btn.addEventListener("click", function() {
    if (step == 0) {
        dinero = parseFloat(document.getElementById('monto').value)
        showNextStep()
    }
    else if (step == 1) {
        let findInt = document.getElementsByClassName('activeInt');
        let foundInt = findInt[0].innerText.slice(0, -1);
        int = parseInt(foundInt)
        console.log(int)
        showNextStep()
    }
    else if (step == 2) {
        let findMonth = document.getElementsByClassName("activeMes");
        let foundMonth = findMonth[0].innerText;
        month = parseFloat(foundMonth)
        console.log(month)
        calculate()
        let planCards = document.querySelectorAll(".main__optionCard");
        console.log(planCards)
        planCards.forEach(element => {
        element.addEventListener("click", function(){
        planCards.forEach(card=>card.classList.remove("activePlan"))
        this.classList.add("activePlan")

            })
        });
        findFinalMonth = document.querySelector(".activePlan .monthData")
        selectedMonth = findFinalMonth.innerText
        findFinalInt = document.querySelector(".activePlan .intData")
        selectedInt = findFinalInt.innerText.slice(0, -1);
        showNextStep()
    }
    else if (step == 3) {

        console.log(selectedMonth)
        console.log(selectedInt)
        let lastStep = document.getElementById("main__divBtn")
        lastStep.className = "hidden"

    }
})

showNextStep()


function calculate(){
    // Aca se busca planes que cumplan con alguna de las dos condiciones

    let planElegido = planes.filter( (elemento)=> elemento.interes == int || elemento.meses == month)

    console.log(planElegido)

    function plazoFijo (monto,interes,meses) {
        let saldos = []
        if (isNaN(parseFloat(monto)) || parseFloat(monto) < 0) {
            alert("Ingrese una cantidad valida de dinero")
            return
        } else if 
            (isNaN(parseFloat(interes)) || parseFloat(interes) < 0) { 
                alert("Ingrese una tasa de interes valida")
            return
        } else if 
            (isNaN(parseFloat(meses)) || parseFloat(meses) < 0) { 
            alert("Ingrese una cantidad valida de meses")
            return
        } else {
            for (let i = 1; i <= meses; i++) {
                monto += interes*monto/100
                saldos.push(monto.toFixed(1))
            }
        }
        return saldos
    }

    planElegido.forEach((el)=> {
        let s = plazoFijo(dinero,el.interes, el.meses)
        let g = s.slice(-1)[0] - dinero
        console.log(g.toFixed(2))    
        el.ganacia = g
        el.montoInicial = dinero
        el.saldos = s
    })

    let planesContenedor = document.getElementById("opcionesPlan")
    let main__optionCards = document.createElement("div")
    main__optionCards.className = "main__optionCards"
    planesContenedor.appendChild(main__optionCards);

    for ([index,planesElegidos] of planElegido.entries()) {
        let opcionPlan = document.createElement("div")
        opcionPlan.className= "main__optionCard"
  
        opcionPlan.innerHTML = `<h3>Plan Nro ${index + 1}</h3>
                                <div class="cardBox">
                                    <div>
                                        <p class="monthData">${planesElegidos.meses}</p>
                                        <p>meses</p>
                                    </div>
                                    <div>
                                        <p>Interes</p>
                                        <p class="intData">${planesElegidos.interes}%</p>
                                    </div>
                                </div>`
        main__optionCards.appendChild(opcionPlan);
    }

    //Aca se elije  automaticamente el plan con mas ganancia

    planElegido.sort((a,b) => b.ganacia - a.ganacia)

    msg = ""

    for (let index = 0; index < planElegido[0].saldos.length; index++) {
        const element = planElegido[0].saldos[index];
        msg += "Saldo Mes Nro " + (index + 1) + " $ " + element + "\n"
    }

    alert(msg)

    let finalMsg = document.getElementById("result")
    let mensaje = document.createElement("div")
    mensaje.innerHTML = `<p>Su saldo Final es de $ ${planElegido[0].saldos.slice(-1)[0]} y Usted Genero $ ${planElegido[0].saldos.slice(-1)[0] - dinero.toFixed(2)} de ganancia</p>`
    finalMsg.appendChild(mensaje)
    return planElegido
}

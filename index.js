//Simulador de Interes Plazo Fijo

let dinero = parseFloat(prompt("Ingrese su Dinero"))

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
        "meses" : 14,
        "interes" : 3,
    },
    {
        "meses" : 20,
        "interes" : 5,
    },
    {
        "meses" : 12,
        "interes" : 3,
    },
    {
        "meses" : 24,
        "interes" : 5,
    }
]

let int = parseFloat(prompt("Que tasa de interes buscas ?"))

let month = parseFloat(prompt("Cuantos meses quieres depositar tu dinero ?"))

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

//Aca se elije  automaticamente el plan con mas ganancia

planElegido.sort((a,b) => b.ganacia - a.ganacia)

msg = ""

for (let index = 0; index < planElegido[0].saldos.length; index++) {
    const element = planElegido[0].saldos[index];
    msg += "Saldo Mes Nro " + (index + 1) + " $ " + element + "\n"
}

alert(msg)

alert("Su saldo Final es de $" + planElegido[0].saldos.slice(-1)[0] +" y Usted Genero $" + (planElegido[0].saldos.slice(-1)[0] - dinero.toFixed(2) + " de ganancia"));

// let finalMsg = document.createElement("p")
// finalMsg.innerText = "Su saldo Final es de $" + planElegido[0].saldos.slice(-1)[0] +" y Usted Genero $" + (planElegido[0].saldos.slice(-1)[0] - dinero.toFixed(2) + " de ganancia")
// document.body.append(finalMsg)
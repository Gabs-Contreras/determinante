function imprimirArray(array, simbolo, result) {
    const output = document.getElementById('output');
    output.innerHTML += `
        ${simbolo} = <table class="table">
            <tbody>
                <tr>
                    <td rowspan="2" class="table-borde">${simbolo} =</td>
                    <td class="table-borde">${array[0][0]}</td>
                    <td class="table-borde">${array[0][1]}</td>
                    <td rowspan="2" class="table-borde">= (${array[0][0]} * ${array[1][1]}) - (${array[1][0]} * ${array[0][1]}) = ${result}</td>
                </tr>
                <tr>
                    <td class="table-borde">${array[1][0]}</td>
                    <td class="table-borde">${array[1][1]}</td>
                </tr>
            </tbody>
        </table>
    `;
}

function calcularDeterminante(matriz) {
    return new Fraction(matriz[0][0]).mul(matriz[1][1]).sub(new Fraction(matriz[1][0]).mul(matriz[0][1]));
}

function mensajeCalculoDeterminante(variable, arrays) {
    const output = document.getElementById('output');
    output.innerHTML += `Para hallar determinante ${variable} vamos a restar la multiplicación de ${arrays[0][0]} por ${arrays[1][1]}, menos ${arrays[1][0]} por ${arrays[0][1]}<br><br>`;
}

function calcularVariable(determinanteX, determinanteY, determinante) {
    const x = new Fraction(determinanteX).div(determinante);
    const y = new Fraction(determinanteY).div(determinante);
    const output = document.getElementById('output');
    output.innerHTML += "------------------------------------------------------------------------------------------------------------------------------- <br>";
    output.innerHTML += "Hallar x & y <br><br>";
    output.innerHTML += "Hallar x  <br><br>";
    output.innerHTML += `Δx/Δ = ${determinanteX}/${determinante} = ${x}<br>`;
    output.innerHTML += `x= ${x}<br><br>`;
    output.innerHTML += "Para calcular x vamos a dividir Δx/Δ que nos da como resultado: " + x + "<br><br>";
    output.innerHTML += "Hallar y <br><br>";
    output.innerHTML += `Δy/Δ = ${determinanteY}/${determinante} = ${y}<br>`;
    output.innerHTML += `y= ${y}<br><br>`;
    output.innerHTML += "Para calcular y vamos a dividir Δy/Δ que nos da como resultado: " + y + "<br><br>";
    return { x, y };
}

function comprobarResultados(arrayInicial, x, y) {
    const resultado1 = arrayInicial[0][2];
    const resultado2 = arrayInicial[1][2];
    const comprobacion1 = new Fraction(arrayInicial[0][0]).mul(x).add(new Fraction(arrayInicial[0][1]).mul(y));
    const comprobacion2 = new Fraction(arrayInicial[1][0]).mul(x).add(new Fraction(arrayInicial[1][1]).mul(y));

    const output = document.getElementById('output');
    
    // Empezamos con un contenido vacío
    output.textContent = "---------------------------------------------------------------------------------------------------------------------------- \n";
    output.textContent += "Comprobar\n";
    output.textContent += "Para comprobar vamos a sustituir en una de las ecuaciones anteriores, si el resultado es el mismo significa que es correcto\n\n\n";
    output.textContent += "Sustituimos...\n\n";
    output.textContent += `${arrayInicial[0][0]}x + ${arrayInicial[0][1]}y = ${arrayInicial[0][2]}\n`;
    output.textContent += `${arrayInicial[0][0]} * ${x} + ${arrayInicial[0][1]} * ${y} = ${comprobacion1}\n`;
    output.textContent += `${arrayInicial[1][0]}x + ${arrayInicial[1][1]}y = ${arrayInicial[1][2]}\n`;
    output.textContent += `${arrayInicial[1][0]} * ${x} + ${arrayInicial[1][1]} * ${y} = ${comprobacion2}\n\n`;

    if (resultado1.equals(comprobacion1) && resultado2.equals(comprobacion2)) {
        output.textContent += "El resultado se comprobó correctamente\n";
        output.textContent += "😄"; // Emoji de cara feliz
    } else {
        output.textContent += "El resultado no coincide\n";
        output.textContent += "😟"; // Emoji de cara triste
    }
}

let step = 0;
let stepsData = [];
let x, y, determinante;

document.getElementById('formulario').addEventListener('submit', function(event) {
    event.preventDefault();

    const a11 = new Fraction(document.getElementById('a11').value);
    const a12 = new Fraction(document.getElementById('a12').value);
    const a13 = new Fraction(document.getElementById('a13').value);
    const a21 = new Fraction(document.getElementById('a21').value);
    const a22 = new Fraction(document.getElementById('a22').value);
    const a23 = new Fraction(document.getElementById('a23').value);

    const arrayInicial = [
        [a11, a12, a13],
        [a21, a22, a23]
    ];

    document.getElementById('output').innerHTML = '';
    stepsData = [];
    step = 0;

    const arrayDeterminante = [
        [arrayInicial[0][0], arrayInicial[0][1]],
        [arrayInicial[1][0], arrayInicial[1][1]]
    ];

    determinante = calcularDeterminante(arrayDeterminante);
    stepsData.push(() => {
        imprimirArray(arrayDeterminante, 'Δ', determinante);
        mensajeCalculoDeterminante('Δ', arrayDeterminante);
    });

    if (!determinante.equals(0)) {
        const arrayX = [
            [arrayInicial[0][2], arrayInicial[0][1]],
            [arrayInicial[1][2], arrayInicial[1][1]]
        ];
        const determinanteX = calcularDeterminante(arrayX);
        stepsData.push(() => {
            imprimirArray(arrayX, 'Δx', determinanteX);
            mensajeCalculoDeterminante('Δx', arrayX);
        });

        const arrayY = [
            [arrayInicial[0][0], arrayInicial[0][2]],
            [arrayInicial[1][0], arrayInicial[1][2]]
        ];
        const determinanteY = calcularDeterminante(arrayY);x
        stepsData.push(() => {
            imprimirArray(arrayY, 'Δy', determinanteY);
            mensajeCalculoDeterminante('Δy', arrayY);
        });

        stepsData.push(() => {
            const resultado = calcularVariable(determinanteX, determinanteY, determinante);
            x = resultado.x;
            y = resultado.y;
        });

        stepsData.push(() => comprobarResultados(arrayInicial, x, y));
    } else {
        stepsData.push(() => {
            const output = document.getElementById('output');
            output.innerHTML += "Este sistema de ecuaciones no tiene solución, debido a que Δ=0, por ende es una matriz singular.";
        });
    }

    stepsData[0]();
    step++;

    document.getElementById('nextStep').style.display = 'block';
});

document.getElementById('nextStep').addEventListener('click', function() {
    if (step < stepsData.length) {
        stepsData[step]();
        step++;
    } else {
        document.getElementById('nextStep').style.display = 'none';
    }
});

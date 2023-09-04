let min = 1;
let max = 500;
let adivinando = false;
let esPar = null;

function empezarAdivinanza() {
  adivinando = true;
  min = 1;
  max = 500;
  esPar = null;
  document.getElementById("adivinanzaContainer").style.display = "block";
  mostrarPregunta();
}

function calcularProbabilidades(esPar, min, max) {
  const posiblesNumeros = [];
  const probabilidades = [];

  for (let i = min; i <= max; i++) {
    if ((esPar === null) || (esPar && i % 2 === 0) || (!esPar && i % 2 !== 0)) {
      posiblesNumeros.push(i);
    }
  }

  if (esPar === null) {
    const totalNumeros = posiblesNumeros.length;
    const numerosPares = posiblesNumeros.filter(numero => numero % 2 === 0).length;
    const numerosImpares = totalNumeros - numerosPares;

    const probabilidadPar = numerosPares / totalNumeros;
    const probabilidadImpar = numerosImpares / totalNumeros;

    for (let i = 0; i < posiblesNumeros.length; i++) {
      const numero = posiblesNumeros[i];
      probabilidades.push(esPar === true ? (numero % 2 === 0 ? probabilidadPar : 0) : (numero % 2 !== 0 ? probabilidadImpar : 0));
    }
  } else {
    const numeroMedio = Math.floor((min + max) / 2);
    const probabilidadMayor = (max - numeroMedio) / (max - min + 1);
    const probabilidadMenor = (numeroMedio - min) / (max - min + 1);

    for (let i = 0; i < posiblesNumeros.length; i++) {
      const numero = posiblesNumeros[i];
      probabilidades.push((esPar === true && numero % 2 === 0) || (esPar === false && numero % 2 !== 0) ? (numero >= numeroMedio ? probabilidadMayor : probabilidadMenor) : 0);
    }
  }

  return {
    posiblesNumeros,
    probabilidades
  };
}

function mostrarPregunta() {
  if (adivinando) {
    document.getElementById("empezar").innerText = `Reiniciar`;
    if (esPar === null) {
      document.getElementById("adivinanza").innerText = `¿Tu número es par o impar?`;
      document.getElementById("siPar").style.display = "inline-block";
      document.getElementById("noPar").style.display = "inline-block";
      document.getElementById("mayor").style.display = "none";
      document.getElementById("menor").style.display = "none";
      document.getElementById("correcto").style.display = "none";
      document.getElementById("posiblesNumeros").innerHTML = "";
    } else {
      const numeroMedio = Math.floor((min + max) / 2);
      document.getElementById("adivinanza").innerText = `¿Tu número es mayor o menor que ${numeroMedio}?`;
      document.getElementById("siPar").style.display = "none";
      document.getElementById("noPar").style.display = "none";
      document.getElementById("mayor").style.display = "inline-block";
      document.getElementById("menor").style.display = "inline-block";
      document.getElementById("correcto").style.display = "inline-block";
    }
  }
}

function mostrarPosiblesNumeros() {
  if (adivinando && esPar !== null) {
    const {
      posiblesNumeros,
      probabilidades
    } = calcularProbabilidades(esPar, min, max);

    const maxProbabilidad = Math.max(...probabilidades);
    const numeroCorrecto = posiblesNumeros[probabilidades.indexOf(maxProbabilidad)];

    const posiblesNumerosHtml = posiblesNumeros.map((numero, index) => {
      let claseDestacada = "";
      if (numero === numeroCorrecto) {
        claseDestacada = "verde";
      } else if (probabilidades[index] > 0) {
        claseDestacada = "rojo";
      }
      return `<span class="${claseDestacada}">${numero}</span>`;
    });

    document.getElementById("posiblesNumeros").innerHTML = posiblesNumerosHtml.join(", ");
    document.getElementById("posiblesNumerosContainer").scrollTop = 0;

    if (posiblesNumeros.length === 1) {
      document.getElementById("correcto").style.display = "inline-block";
      document.getElementById("adivinanza").innerText = `¡Tu número es ${numeroCorrecto}!`;
      adivinando = false;
    }
  }
}

function responder(respuesta) {
  if (adivinando) {
    if (esPar === null) {
      if (respuesta === "par") {
        esPar = true;
        min = 2;
      } else if (respuesta === "impar") {
        esPar = false;
        min = 1;
      }
      document.getElementById("mayor").style.display = "inline-block";
      document.getElementById("menor").style.display = "inline-block";
      document.getElementById("correcto").style.display = "inline-block";
    } else {
      const numeroMedio = Math.floor((min + max) / 2);
      if (respuesta === "mayor") {
        min = numeroMedio + 1;
      } else if (respuesta === "menor") {
        max = numeroMedio;
      } else if (respuesta === "correcto") {
        const {
          posiblesNumeros,
          probabilidades
        } = calcularProbabilidades(esPar, min, max);

        const maxProbabilidad = Math.max(...probabilidades);
        const numeroCorrecto = posiblesNumeros[probabilidades.indexOf(maxProbabilidad)];

        document.getElementById("adivinanza").innerText = `¡Tu número es ${numeroCorrecto}!`;
        adivinando = false;
      }
    }

    if (min > max) {
      document.getElementById("adivinanza").innerText = `¡Tu número no puede estar en este rango!`;
    } else if (min === max) {
      document.getElementById("adivinanza").innerText = `¡Tu número es ${min}!`;
      adivinando = false;
    } else {
      mostrarPregunta();
    }

    mostrarPosiblesNumeros();
  }
}
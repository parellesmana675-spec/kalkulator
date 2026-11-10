// =======================================
// FUTURISTIC MAROON RED CALCULATOR
// =======================================

const result = document.getElementById("result");
const historyDisplay = document.getElementById("history");
const buttons = document.querySelectorAll(".buttons button");

let expression = "";
let finished = false;

// Memperbarui layar kalkulator
function updateDisplay() {
    result.value = expression || "0";

    // Menyesuaikan ukuran angka agar tidak meluap
    if (result.value.length > 12) {
        result.style.fontSize = "24px";
    } else {
        result.style.fontSize = "";
    }
}

// Mengubah operator menjadi simbol yang lebih menarik
function formatExpression(value) {
    return value
        .replace(/\*/g, " × ")
        .replace(/\//g, " ÷ ")
        .replace(/\+/g, " + ")
        .replace(/-/g, " − ");
}

// Menampilkan notifikasi pada layar
function showMessage(message) {
    historyDisplay.textContent = message;
}

// Memeriksa ekspresi matematika
function calculateExpression(input) {
    // Hanya menerima angka dan operator matematika
    if (!/^[0-9+\-*/.()\s]+$/.test(input)) {
        throw new Error("Ekspresi tidak valid");
    }

    // Memeriksa pembagian dengan nol
    if (/\/\s*0(?:\.0*)?(?![\d.])/.test(input)) {
        throw new Error("Pembagian dengan nol");
    }

    const answer = Function(
        '"use strict"; return (' + input + ')'
    )();

    if (!Number.isFinite(answer)) {
        throw new Error("Hasil tidak valid");
    }

    return Number(answer.toPrecision(12));
}

// Menghitung hasil
function calculate() {
    if (!expression) return;

    try {
        const originalExpression = expression;
        const answer = calculateExpression(expression);

        showMessage(
            formatExpression(originalExpression) + " ="
        );

        expression = String(answer);
        finished = true;

        updateDisplay();

        // Efek visual ketika hasil muncul
        result.style.color = "#ff647f";

    } catch (error) {
        showMessage(
            error.message === "Pembagian dengan nol"
                ? "Tidak bisa dibagi dengan nol!"
                : "Perhitungan tidak valid!"
        );

        result.value = "Error";
        expression = "";
        finished = false;
    }
}

// Memasukkan angka atau operator
function inputValue(value) {
    if (finished) {
        if (/[0-9.]/.test(value)) {
            expression = "";
            showMessage("Perhitungan baru");
        }

        finished = false;
    }

    // Operator tidak boleh berada di awal,
    // kecuali tanda minus.
    if (/[+*/]/.test(value) && !expression) {
        return;
    }

    // Mengganti operator sebelumnya
    if (/[+\-*/]/.test(value) &&
        /[+\-*/]$/.test(expression)) {
        expression = expression.slice(0, -1);
    }

    // Mencegah titik desimal ganda
    if (value === ".") {
        const currentNumber = expression
            .split(/[+\-*/]/)
            .pop();

        if (currentNumber.includes(".")) {
            return;
        }

        if (!currentNumber) {
            value = "0.";
        }
    }

    expression += value;

    showMessage(formatExpression(expression));
    updateDisplay();
}

// Menghapus seluruh perhitungan
function clearCalculator() {
    expression = "";
    finished = false;

    updateDisplay();
    showMessage("Siap menghitung");
}

// Menghapus satu karakter
function deleteLast() {
    if (finished) {
        expression = "";
        finished = false;
    } else {
        expression = expression.slice(0, -1);
    }

    updateDisplay();
    showMessage(
        expression
            ? formatExpression(expression)
            : "Siap menghitung"
    );
}

// Menghitung persentase
function calculatePercent() {
    if (!expression) return;

    const match = expression.match(/(\d*\.?\d+)$/);

    if (!match) return;

    const percentage = Number(match[0]) / 100;

    expression = expression.slice(
        0,
        -match[0].length
    ) + String(percentage);

    finished = false;

    updateDisplay();
    showMessage("Persentase: " + formatExpression(expression));
}

// Menghubungkan tombol dengan fungsi
buttons.forEach(button => {
    button.addEventListener("click", () => {
        // Efek klik tombol
        button.style.transform = "scale(0.92)";

        setTimeout(() => {
            button.style.transform = "";
        }, 120);

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
            return;
        }

        if (action === "delete") {
            deleteLast();
            return;
        }

        if (action === "calculate") {
            calculate();
            return;
        }

        if (action === "percent") {
            calculatePercent();
            return;
        }

        if (value !== undefined) {
            inputValue(value);
        }
    });
});

// Dukungan keyboard laptop atau komputer
document.addEventListener("keydown", event => {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        inputValue(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
        inputValue(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key === "Escape" || key === "Delete") {
        clearCalculator();
    } else if (key === "%") {
        calculatePercent();
    }
});

// Tampilan awal
updateDisplay();
showMessage("Siap menghitung");

console.log("Maroon Calculator berhasil dijalankan!");
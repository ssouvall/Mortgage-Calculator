//Create an empty array to store user input
let loanArray = [];

//Get user input from form
function getUserInput() {
    let loanDetails = JSON.parse(localStorage.getItem("loanArray")) || [];

    let obj = {};
    obj["amount"] = parseInt(document.getElementById("loanAmount").value);
    obj["term"] = parseInt(document.getElementById("loanTerm").value);
    obj["rate"] = parseInt(document.getElementById("loanRate").value);

    loanArray.push(obj);

    localStorage.setItem("loanArray", JSON.stringify(loanDetails));
    getPaymentAmount()
};

function getPaymentAmount() {
    let loanAmount = 0;
    let monthlyPayment = 0;
    let interestRate = 0;
    let months = 0;

    for (let i = 0; i < loanArray.length; i++) {
        loanAmount = loanArray[i].amount;
        interestRate = (loanArray[i].rate) / 100 / 12;
        months = (loanArray[i].term) * 12;
    };

    // monthlyPayment = loanAmount * interestRate * (Math.pow(1 + interestRate, months)) / (Math.pow(1 + interestRate, months) - 1);

    monthlyPayment = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -months))

    let loanInfo = {
        monthlyPayment: monthlyPayment,
        interestRate: interestRate,
        term: months,
        loanBalance: loanAmount
    };

    buildPaymentSchedule(loanInfo);
};

function buildPaymentSchedule(obj) {
    let paymentArray = [];

    let loanTerm = obj.term;
    let payment = obj.monthlyPayment;
    let rate = obj.interestRate;
    let totalLoan = obj.loanBalance;
    let loanBalance = totalLoan;
    let principalPayment = 0;
    let monthlyInterest = 0;
    let month = 0;

    //calculate interest, principal, and loan balance
    for (let i = 0; i < loanTerm; i++) {
        monthlyInterest = rate * loanBalance;
        principalPayment = payment - monthlyInterest;
        loanBalance -= (principalPayment)
        month++
        paymentArray.push({
            month,
            payment,
            monthlyInterest,
            principalPayment,
            loanBalance
        })
    };
    displayData(paymentArray)
};

function displayData(array) {
    const template = document.getElementById('data-template');
    const resultsBody = document.getElementById('resultsBody');

    resultsBody.innerHTML = "";

    for (let i = 0; i < array.length; i++) {
        const dataRow = document.importNode(template.content, true);

        dataRow.getElementById("month").textContent = (array[i].month)
        dataRow.getElementById("payment").textContent = (array[i].payment).toLocaleString(
            undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
        dataRow.getElementById("principal").textContent = (array[i].principalPayment).toLocaleString(
            undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
        dataRow.getElementById("interest").textContent = (array[i].monthlyInterest).toLocaleString(
            undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );
        dataRow.getElementById("tot_interest").textContent = "TBD";
        dataRow.getElementById("balance").textContent = (array[i].loanBalance).toLocaleString(
            undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );

        resultsBody.appendChild(dataRow);
    };
};
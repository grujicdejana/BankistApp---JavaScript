'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    //console.log(type);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//displayMovements(account1.movements);

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner //with this we create a new property username, on account object
      .split(' ')
      .map(word => word.slice(0, 1).toLocaleLowerCase())
      .join('');
  });
};

createUsername(accounts);

//login
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //console.log(currentAccount);
  
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); 

    //Display balance, summary and movements
    updateUI(currentAccount);
  } else {
    labelWelcome.textContent = `There is no user with this PIN 😞`;
    containerApp.style.opacity = 0;
  }
});


//balance value
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//calcDisplayBalance(account1.movements);

const caclDisplaySummary = function (acc) {
  const summaryIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${summaryIn}€`;

  const summaryOut = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(summaryOut)}€`;

  //interest is paid on each deposit, interest is for example 1.2% of the deposited amount
  //bank only pays an interest, if that interest is at least one euro (only then it will be added to total)
  const percent = acc.interestRate / 100;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => percent * deposit)
    .filter(inter => inter >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//caclDisplaySummary(account1.movements);

//transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  const transferAmount = Number(inputTransferAmount.value);

  if (
    transferAmount > 0 &&
    currentAccount.balance >= transferAmount &&
    receiver?.username !== currentAccount.username
  ) {
    //console.log('Transfer valid');
	//Doing the transfer	
	receiver.movements.push(transferAmount);
	currentAccount.movements.push(-transferAmount);
	
	//Update UI
	updateUI(currentAccount);
  }
  
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

const updateUI = function (currAcc) {
  //Display movements
  displayMovements(currAcc.movements);
  //Display balance
  calcDisplayBalance(currAcc);
  //Display summary
  caclDisplaySummary(currAcc);
};

//close the account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount?.pin
  ) {
    const closeAccount = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    //console.log(closeAccount);

    accounts.splice(closeAccount, 1);
    logOut();
  } else {
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur();
    console.log("You cannot delete someone's other account");
  }
});

//logout
const logOut = function () {
  labelWelcome.textContent = `Log in to get started`;
  containerApp.style.opacity = 0;
};

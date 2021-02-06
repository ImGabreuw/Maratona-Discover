//OBS: 'const' = objeto não vai alterado no resto da aplicação

const Modal = { // Criação de um objeto
    open() { // Criação de uma função
        document
            .querySelector('.modal-overlay') //Busca por todo o documento HTML pela classe = '.model-overlay'
            .classList
            .add('active') //Adição do elemento 'active' na classe 
    },
    close() {
        document
            .querySelector('.modal-overlay') //Busca por todo o documento HTML pela classe = '.model-overlay'
            .classList
            .remove('active') //Remoção do elemento 'active' na classe 
    }
}

const Storage = {
    get() {
        return JSON
            .parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem(
            "dev.finances:transactions",
            JSON.stringify(transactions) // .stringify() = Array -> String
        )
    }
}

const Transaction = {
    // Refatoração
    all: Storage.get(),

    add(transaction) { // Adição de uma nova transação
        Transaction.all.push(transaction)

        App.reload()
    },
    remove(index) { // Remoção de uma transação
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() { // Somar as entradas
        let income = 0;
        // Pegar todas as transações
        // Para cada transação:
        Transaction.all.forEach(transaction => {
            // Se ela for maior que zero
            if(transaction.amount > 0) {
                // Somar a uma variável e retorna-la
                income += transaction.amount
            }
        })

        return income;
    },
    expenses() { // Somar as saídas
        let expense = 0;
        // Pegar todas as transações
        // Para cada transação:
        Transaction.all.forEach(transaction => {
            // Se ela for maior que zero
            if(transaction.amount < 0) {
                // Somar a uma variável e retorna-la
                expense += transaction.amount
            }
        })

        return expense;
    },
    total() { // = Entradas - Saídas
        return Transaction.incomes() + Transaction.expenses();
    }
}

// DOM = Document Object Model
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')

        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        // Interpolação (Template literals)
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./resources/minus.svg" alt="Remover transação">
            </td>
        `

        return html;
    },
    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        /* REGEX (EXPRESSÃO REGULAR):

        - /0/g = substituição de todos os zeros por algum outro valor
        - /\D/ (SCAPE) = achar todos os valores que são números
        */
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
            )

        return signal + value
    },
    formatAmount(value) {
        value = Number(value) * 100
        return Math.round(value);
    },
    formatDate(value) {
        const splittedDate = value.split("-")
        return splittedDate
            .reverse()
            .join("/")
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    formatValues() {
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
        }
    },
    validateFields() {
        const {description, amount, date} = Form.getValues()

        // .trim() = remoção de todos os espaçamentos na String
        if(
            description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === ""
        ) {
            throw new Error("Por favor, preencha todos os campos.")
        }
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },
    clearFields() {
        Form.description = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    submit(event) {
        event.preventDefault()

        try {
            // Verificar se todas as informações foram preenchidas
            Form.validateFields()
            // Formatar os dados para salvar
            const transaction = Form.formatValues()
            // Salvar
            Form.saveTransaction(transaction)
            // Limpar os dados do formulário
            Form.clearFields()
            // Modal feche
            Modal.close()
        } catch(error) {
            alert(error.message)
            // Upgrade: criar um novo modal para mostrar o alerta
        }
    }
}

const App = {
    init() {
        // Method reference (COMO NO JAVA)
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()

        App.init()
    }
}

App.init()
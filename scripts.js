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

const Transaction = {
    // Refatoração
    all: [
        {
            description: 'Luz',
            amount: -50000, // = - 500,00
            date: '23/01/2021'
        },
        {
            description: 'Website',
            amount: 500000, // = + 5.000,00
            date: '23/01/2021'
        },
        {
            description: 'Internet',
            amount: -20000, // = - 200,00
            date: '23/01/2021'
        },
        {
            description: 'App',
            amount: 200000, // = + 2.000,00
            date: '23/01/2021'
        },
    ],

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

        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        // Interpolação (Template literals)
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./resources/minus.svg" alt="Remover transação">
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

    submit(event) {
        event.preventDefault()

        try {
            // Verificar se todas as informações foram preenchidas
            Form.validateFields()
            // Formatar os dados para salvar
            // Salvar
            // Limpar os dados do formulário
            // Modal feche
            // Atualizar a aplicação
        } catch(error) {
            alert(error.message)
            // Upgrade: criar um novo modal para mostrar o alerta
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })

        DOM.updateBalance()
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}

App.init()
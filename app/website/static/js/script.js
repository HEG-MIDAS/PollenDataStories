const questions = [
    {
        question: "Quel pourcentage des jeunes utilisent leur smartphone plus de 4 heures par jour ?",
        answers: [
            { text: "30%", correct: false },
            { text: "50%", correct: false },
            { text: "70%", correct: true },
            { text: "90%", correct: false }
        ],
        info: "En 2021, une étude a révélé que 70% des jeunes utilisent leur smartphone plus de 4 heures par jour."
    },
    {
        question: "Quel est le principal polluant de l'air à Genève ?",
        answers: [
            { text: "Ozone", correct: false },
            { text: "Monoxyde de carbone", correct: false },
            { text: "Dioxyde d'azote", correct: true },
            { text: "Particules fines", correct: false }
        ],
        info: "Le dioxyde d'azote est le principal polluant de l'air à Genève, principalement dû au trafic routier."
    },
    // Ajoutez plus de questions ici
];

let currentQuestionIndex = 0;
let correctAnswersCount = 0;

document.querySelectorAll('.list-group-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.list-group-item').forEach(li => li.classList.remove('selected'));
        item.classList.add('selected');
    });
});

function loadQuestion(index) {
    const question = questions[index];
    document.getElementById('question-text').innerText = question.question;
    const answersList = document.getElementById('answers-list');
    answersList.innerHTML = '';

    question.answers.forEach(answer => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.setAttribute('data-correct', answer.correct);
        li.innerText = answer.text;
        li.addEventListener('click', () => {
            document.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('selected'));
            li.classList.add('selected');
        });
        answersList.appendChild(li);
    });

    // Hide the flip button and show the check button
    document.getElementById('flip-button').style.display = 'none';
    document.getElementById('check-button').style.display = 'inline';
    document.getElementById('message').innerHTML = ''; // Clear previous messages
}

function checkAnswer() {
    const selected = document.querySelector('.list-group-item.selected');
    const messageDiv = document.getElementById('message');
    const checkButton = document.getElementById('check-button');
    const flipButton = document.getElementById('flip-button');
    const infoButton = document.getElementById('info-button');
    
    messageDiv.innerHTML = '';  // Clear any previous messages

    if (!selected) {
        messageDiv.innerHTML = '<div class="alert alert-warning">Veuillez sélectionner une réponse.</div>';
        return;
    }

    if (selected.getAttribute('data-correct') === 'true') {
        correctAnswersCount++;
        selected.classList.add('correct');
        messageDiv.innerHTML = '<div class="alert alert-success">Bravo, c\'est la bonne réponse !</div>';
    } else {
        selected.classList.add('incorrect');
        messageDiv.innerHTML = '<div class="alert alert-danger">Bien essayé !</div>';
        // Highlight the correct answer
        document.querySelector('.list-group-item[data-correct="true"]').classList.add('correct');
    }

    // Disable further selection
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.style.pointerEvents = 'none';
    });

    // Remove the check button
    checkButton.style.display = 'none';

    // Show the flip button
    flipButton.style.display = 'inline';

    if (currentQuestionIndex >= questions.length - 1) {
        infoButton.innerText = 'Voir résultat';
    } else {
        infoButton.innerText = 'Question suivante';
    }
}

function flipCard() {
    document.querySelector('.flip-card-inner').classList.add('flip-card-trans');
    const question = questions[currentQuestionIndex];
    document.getElementById('info-text').innerText = question.info;
    setTimeout(function(){
        document.querySelector('#question-text').innerHTML = '';
        document.querySelector('#answers-list').innerHTML = '';
        document.querySelector('#message').innerHTML = '';
        document.getElementById('flip-button').style.display = 'none';
    }, 150);
}

function nextQuestion() {
    document.querySelector('.flip-card-inner').classList.remove('flip-card-trans');
    setTimeout(function(){
        if (currentQuestionIndex >= questions.length - 1) {
            showFinalMessage();
        } else {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
            document.querySelectorAll('.list-group-item').forEach(item => item.style.pointerEvents = 'auto');
            document.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('correct', 'incorrect', 'selected'));
        }
    }, 200);
}

function showFinalMessage() {
    document.querySelector('.flip-card-front .card .card-body').innerHTML = `
        <h1 class="card-title text-center">Quiz terminé !</h1>
        <div class="text-center mb-3">
            <p>Bravo, vous avez terminé le quiz !</p>
            <p>Vous avez répondu correctement à ${correctAnswersCount} questions sur ${questions.length}.</p>
        </div>
    `;
}

// Load the first question
loadQuestion(currentQuestionIndex);
const questions = [
    {
        question: "Quel trio de plantes présentes en Suisses sont très allergènes ?",
        answers: [
            { text: "Ambroisie, Bouleau, Graminées", correct: true },
            { text: "Châtaigner, Peuplier, Tournesol", correct: false },
            { text: "Saule, Olivier, Sapin", correct: false },
            { text: "Pommier, Poirier, Cerisier", correct: false }
        ],
        info: `L'Ambroisie, le Bouleau, et les Graminées sont des plantes qui produisent beaucoup de pollen très allergène. Cela signifie que leur pollen peut facilement rendre les personnes allergiques malades.

        Les autres plantes comme le Châtaigner, le Peuplier, le Tournesol, le Saule, l'Olivier, et le Sapin produisent du pollen, mais ce pollen est moins allergène.
        
        Les arbres comme le Pommier, le Poirier, et le Cerisier sont des arbres fruitiers. Ils utilisent les insectes pour transporter leur pollen, donc leur pollen n'est pas vraiment allergène.
        `
    },
    {
        question: "Quelle est cette plante très allergène ? <br><img class='img-class rounded' src='static/images/ambroisie.jpg' alt='Image d'une plante allergène' class='img-fluid'>",
        answers: [
            { text: "Ambroisie", correct: true },
            { text: "Bouleau", correct: false },
            { text: "Graminées", correct: false },
            { text: "Une autre plante", correct: false }
        ],
        info: `Il s'agit de l'Ambroisie`
    },
    {
        question: "Quelle est cette plante très allergène ? <br><img class='img-class rounded' src='static/images/bouleau.jpg' alt='Image d'une plante allergène' class='img-fluid'>",
        answers: [
            { text: "Bouleau", correct: true },
            { text: "Ambroisie", correct: false },
            { text: "Graminées", correct: false },
            { text: "Une autre plante", correct: false }
        ],
        info: `Il s'agit du Bouleau`
    },
    {
        question: "Quelle est cette plante très allergène ? <br><img class='img-class rounded' src='static/images/graminees.jpg' alt='Image d'une plante allergène' class='img-fluid'>",
        answers: [
            { text: "Graminées", correct: true },
            { text: "Ambroisie", correct: false },
            { text: "Bouleau", correct: false },
            { text: "Une autre plante", correct: false }
        ],
        info: `Il s'agit de Graminées`
    },
    {
        question: "Comment se comportent les pollens de l'Ambroisie, du Bouleau et des Graminées depuis 1994 ?",
        answers: [
            { text: "Leur comportement a évolué, mais il est différent en fonction de l'espèce", correct: true },
            { text: "Il ne se passe rien. Ils démarrent plus ou moins aux mêmes dates, et le pollen qu'ils émettent est environ le même au fil des années", correct: false },
            { text: "Ils sont tous de plus en plus fort", correct: false },
            { text: "Ils durent tous plus longtemps dans l'année", correct: false }
        ],
        info: `Le pollen est une petite poussière que les plantes libèrent dans l'air pour se reproduire.

        En observant les pollens de l'Ambroisie, du Bouleau et des Graminées depuis 1994, nous avons remarqué des évolutions dans leur comportement.
        
        Ces trois plantes commencent à produire du pollen de plus en plus tôt dans l'année. L'Ambroisie et le Bouleau produisent du pollen pendant une période plus longue chaque année, contrairement aux Graminées. Finalement, le Bouleau produit de plus en plus de pollen, alors que l'Ambroisie et les Graminées en produisent de moins en moins.`
    },
    {
        question: "Que sont les polluants atmosphériques ?",
        answers: [
            { text: "Les polluants atmosphériques sont des substances nuisibles dans l'air, provenant des activités humaines et naturelles, qui peuvent être mauvaises pour notre santé et pour la nature", correct: true },
            { text: "Les polluants atmosphériques sont des petits êtres vivants dans l'air qui aident les plantes à pousser", correct: false },
            { text: "Les polluants atmosphériques sont des morceaux d'étoiles qui tombent du ciel et changent le climat", correct: false },
            { text: "Les polluants atmosphériques sont des rayons du soleil arrêtés par l'atmosphère pour protéger la vie sur Terre", correct: false }
        ],
        info: `Les polluants atmosphériques sont des substances dans l'air qui peuvent être mauvaises pour notre santé et pour la nature. Ils peuvent venir de différentes sources, comme les voitures, les usines, et même les feux de forêt.

        Ces polluants peuvent faire tousser, rendre la respiration difficile, et même causer des maladies. Ils peuvent aussi nuire aux plantes, aux animaux et à notre planète. C'est pourquoi il est important de trouver des moyens de réduire la pollution de l'air, comme utiliser des voitures électriques, planter des arbres, et faire attention à ne pas polluer.`
    },
    {
        question: "Quel est l'impact des polluants atmosphériques sur les pollens ?",
        answers: [
            { text: "Ils les rendent plus allergènes", correct: true },
            { text: "Ils ne font rien", correct: false },
            { text: "Le pollen devient jaune", correct: false },
            { text: "Ils les rendent invisibles", correct: false }
        ],
        info: `Les polluants atmosphériques peuvent rendre les pollens plus allergènes. Cela signifie que quand il y a beaucoup de pollution dans l'air, les personnes qui sont allergiques au pollen peuvent se sentir encore plus mal. Le pollen est une petite poussière que les plantes libèrent dans l'air pour se reproduire. Quand nous le respirons, il peut parfois nous faire éternuer ou nous faire avoir les yeux qui piquent. Mais quand il y a beaucoup de pollution, ces effets peuvent être encore plus forts.`
    },
    {
        question: "Comment évoluent les polluants atmosphériques depuis 2011 ?",
        answers: [
            { text: "Ils évoluent différement", correct: true },
            { text: "Ils augmentent tous", correct: false },
            { text: "Ils diminuent tous", correct: false },
            { text: "Ils sont stables", correct: false }
        ],
        info: `Depuis 2011, certains types de polluants atmosphériques ont diminué. Cependant, un autre type de polluant atmosphérique a augmenté. Cela montre que la pollution de l'air peut changer de différentes manières et n'évolue pas toujours de la même façon.`
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

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

function loadQuestion(index) {
    const question = questions[index];
    document.getElementById('question-text').innerHTML = question.question;
    const answersList = document.getElementById('answers-list');
    answersList.innerHTML = '';

    shuffle(question.answers);
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
            <button class="btn btn-primary mt-3" onclick="reloadPage()">Recommencer</button>
        </div>
    `;
}

function reloadPage() {
    location.reload();
}

// Load the first question
loadQuestion(currentQuestionIndex);
document.addEventListener('DOMContentLoaded', () => {
    fetch('index4.json')
        .then(response => response.json())
        .then(questions => {
            console.log('Questions loaded:', questions);
            startQuiz(questions);
        })
        .catch(error => console.error("Error loading quiz:", error));

    function startQuiz(questions) {
        let currentQuestionIndex = 0;
        let score = 0;
        let timerInterval;
        let userAnswers = []; 
    
        const questionElement = document.getElementById('question');
        const optionsElement = document.getElementById('options');
        const resultatElement = document.getElementById('resultat');
        const nextButton = document.getElementById('next');
        const timerElement = document.getElementById('timer');
        const quizContainer = document.getElementById('quiz-container');
    
        const resultatButton = document.createElement('button');
        resultatButton.textContent = 'Résultat';
        resultatButton.id = 'resultat';
        resultatButton.style.display = 'none';
        quizContainer.appendChild(resultatButton);
    
        resultatButton.addEventListener('click', function() {
            questionElement.style.display = 'none';
            optionsElement.style.display = 'none';
            nextButton.style.display = 'none';
            resultatButton.style.display = 'none';
            timerElement.style.display = 'none';
            document.getElementById('progress').style.display = 'none';
            document.getElementById('score').style.display = 'none';
    
            resultatElement.innerHTML = `<h1>Fin du Quiz</h1><p>Votre score est de ${score} sur ${questions.length}.</p>`;
            resultatElement.style.display = 'block';


    
            questions.forEach((question, index) => {
                const userAnswerIndex = userAnswers[index];
                const userAnswerText = userAnswerIndex !== undefined ? question.options[userAnswerIndex] : 'Pas de réponse';
                const correctAnswerText = question.options[question.answer];
                const correctionClass = userAnswerIndex === undefined ? 'no-answer' : (userAnswerIndex === question.answer ? 'correct-answer' : 'wrong-answer');
                resultatElement.innerHTML += `<div class="${correctionClass}">Question ${index + 1}: Votre réponse - "${userAnswerText}". Réponse correcte - "${correctAnswerText}"</div>`;
            });
        });
    
        function updateScoreAndProgress() {
            document.getElementById('score').textContent = `Score : ${score} sur ${questions.length}`;
            document.getElementById('progress').textContent = `Question ${currentQuestionIndex + 1} sur ${questions.length}`;
            nextButton.style.display = currentQuestionIndex < questions.length - 1 ? 'inline' : 'none';
            resultatButton.style.display = currentQuestionIndex === questions.length - 1 ? 'inline' : 'none';
        }
    
        function showQuestion(question) {
            clearInterval(timerInterval);
            startTimer();
            questionElement.textContent = question.question;
            optionsElement.innerHTML = '';
            question.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.textContent = option;
                button.addEventListener('click', () => selectOption(index));
                optionsElement.appendChild(button);
            });
    
            if (userAnswers[currentQuestionIndex] !== undefined) {
                const selectedOptionIndex = userAnswers[currentQuestionIndex];
                optionsElement.children[selectedOptionIndex].classList.add('selected');
            }
    
            updateScoreAndProgress();
        }
    
        function startTimer() {
            let time = 30;
            timerElement.textContent = `Temps : ${time}`;
            timerInterval = setInterval(() => {
                time--;
                timerElement.textContent = `Temps : ${time}`;
                if (time <= 0) {
                    clearInterval(timerInterval);
                    moveToNextQuestion();
                }
            }, 1000);
        }
    
        function selectOption(selectedIndex) {
            clearInterval(timerInterval);
            userAnswers[currentQuestionIndex] = selectedIndex;
            const options = document.querySelectorAll('#options button');
            options.forEach((option, index) => {
                option.classList.remove('selected');
                if (selectedIndex === index) {
                    option.classList.add('selected');
                }
            });
        }
    
        function updateScore() {
            score = userAnswers.reduce((acc, answer, index) => acc + (answer === questions[index].answer ? 1 : 0), 0);
        }
    
        updateScore();
    
        function moveToNextQuestion() {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                updateScore();
                showQuestion(questions[currentQuestionIndex]);
            }
        }

        nextButton.addEventListener('click', moveToNextQuestion);

        showQuestion(questions[currentQuestionIndex]);
    }
});

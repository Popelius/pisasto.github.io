let database;

async function loadDatabase() {

    const response =
        await fetch("visa_kysymykset.json");

    database =
        await response.json();

    createRounds();
}

function createRounds() {

    const container =
        document.getElementById("roundContainer");

    container.innerHTML = "";

    const roundCount =
        parseInt(
            document.getElementById(
                "roundCount"
            ).value
        );

    for (let round = 1;
         round <= roundCount;
         round++) {

        const roundDiv =
            document.createElement("div");

        roundDiv.className = "round";

        roundDiv.innerHTML = `
            <h2>Kierros ${round}</h2>

            <div class="columns">

                <div class="column">
                    <h3>Vaikeudet</h3>
                    ${database.difficulties
                        .filter(d => d.id !== 0)
                        .map(d => `
                            <label>
                                <input
                                    type="checkbox"
                                    class="difficulty"
                                    data-round="${round}"
                                    value="${d.id}">
                                ${d.name}
                            </label><br>
                        `).join("")}
                </div>

                <div class="column">
                    <h3>Kategoriat</h3>
                    ${database.categories
                        .filter(c => c.id !== 0)
                        .map(c => `
                            <label>
                                <input
                                    type="checkbox"
                                    class="category"
                                    data-round="${round}"
                                    value="${c.id}">
                                ${c.name}
                            </label><br>
                        `).join("")}
                </div>

                <div class="column">
                    <h3>Alakategoriat</h3>
                    ${database.sub_categories
                        .filter(s => s.id !== 0)
                        .map(s => `
                            <label>
                                <input
                                    type="checkbox"
                                    class="subcategory"
                                    data-round="${round}"
                                    value="${s.id}">
                                ${s.name}
                            </label><br>
                        `).join("")}
                </div>

            </div>
        `;

        container.appendChild(roundDiv);
    }
}

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [array[i], array[j]] =
        [array[j], array[i]];
    }

    return array;
}

function generateQuiz() {

    const output =
        document.getElementById("output");

    output.innerHTML = "";

    const usedQuestionIds =
        new Set();

    const rounds =
        parseInt(
            document.getElementById(
                "roundCount"
            ).value
        );

    const questionCount =
        parseInt(
            document.getElementById(
                "questionCount"
            ).value
        );

    for (
        let round = 1;
        round <= rounds;
        round++
    ) {

        const difficulties =
            [...document.querySelectorAll(
                `.difficulty[data-round="${round}"]:checked`
            )].map(x => Number(x.value));

        const categories =
            [...document.querySelectorAll(
                `.category[data-round="${round}"]:checked`
            )].map(x => Number(x.value));

        const subcategories =
            [...document.querySelectorAll(
                `.subcategory[data-round="${round}"]:checked`
            )].map(x => Number(x.value));

        let availableQuestions =
            database.questions.filter(q => {

                if (
                    usedQuestionIds.has(
                        q.question_id
                    )
                ) {
                    return false;
                }

                const difficultyMatch =
                    difficulties.length === 0 ||
                    difficulties.includes(
                        q.difficulty_id
                    );

                const categoryMatch =
                    categories.length === 0 ||
                    q.category_ids.some(id =>
                        categories.includes(id)
                    );

                const subcategoryMatch =
                    subcategories.length === 0 ||
                    q.subcategory_ids.some(id =>
                        subcategories.includes(id)
                    );

                return (
                    difficultyMatch &&
                    categoryMatch &&
                    subcategoryMatch
                );
            });

        shuffle(availableQuestions);

        const selected =
            availableQuestions.slice(
                0,
                questionCount
            );

        selected.forEach(q => {
            usedQuestionIds.add(
                q.question_id
            );
        });

        output.innerHTML +=
            `<h2>KIERROS ${round}</h2>`;

        selected.forEach((q, index) => {

            output.innerHTML += `
                <div class="question">

                    <b>
                        Kysymys ${index + 1}
                    </b>

                    <br><br>

                    ${q.question}

                    <details>
                        <summary>
                            Näytä vastaus
                        </summary>

                        ${q.answer}

                    </details>

                </div>
            `;
        });
    }
}

loadDatabase();

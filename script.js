let database;

async function loadDatabase() {

    const response = await fetch("visa_kysymykset.json");
    database = await response.json();

    createFilters();
}

function createFilters() {

    const categoryDiv = document.getElementById("categories");
    const subcategoryDiv = document.getElementById("subcategories");
    const difficultyDiv = document.getElementById("difficulties");

    database.categories.forEach(cat => {

        if (cat.id === 0) return;

        categoryDiv.innerHTML += `
            <label>
                <input type="checkbox"
                       class="category"
                       value="${cat.id}">
                ${cat.name}
            </label><br>
        `;
    });

    database.sub_categories.forEach(sub => {

        if (sub.id === 0) return;

        subcategoryDiv.innerHTML += `
            <label>
                <input type="checkbox"
                       class="subcategory"
                       value="${sub.id}">
                ${sub.name}
            </label><br>
        `;
    });

    database.difficulties.forEach(diff => {

        if (diff.id === 0) return;

        difficultyDiv.innerHTML += `
            <label>
                <input type="checkbox"
                       class="difficulty"
                       value="${diff.id}">
                ${diff.name}
            </label><br>
        `;
    });
}

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
        [array[j], array[i]];
    }

    return array;
}

function generateQuiz() {

    const questionCount =
        parseInt(
            document.getElementById(
                "questionCount"
            ).value
        );

    const selectedCategories =
        [...document.querySelectorAll(".category:checked")]
        .map(x => Number(x.value));

    const selectedSubcategories =
        [...document.querySelectorAll(".subcategory:checked")]
        .map(x => Number(x.value));

    const selectedDifficulties =
        [...document.querySelectorAll(".difficulty:checked")]
        .map(x => Number(x.value));

    let questions = database.questions.filter(q => {

        const categoryMatch =
            selectedCategories.length === 0 ||
            q.category_ids.some(id =>
                selectedCategories.includes(id));

        const subcategoryMatch =
            selectedSubcategories.length === 0 ||
            q.subcategory_ids.some(id =>
                selectedSubcategories.includes(id));

        const difficultyMatch =
            selectedDifficulties.length === 0 ||
            selectedDifficulties.includes(
                q.difficulty_id
            );

        return categoryMatch &&
               subcategoryMatch &&
               difficultyMatch;
    });

    shuffle(questions);

    questions =
        questions.slice(0, questionCount);

    const output =
        document.getElementById("output");

    output.innerHTML = "";

    questions.forEach((q, index) => {

        output.innerHTML += `
            <div class="question">
                <b>Kysymys ${index + 1}</b><br>
                ${q.question}
                <br><br>
                <b>Vastaus:</b>
                ${q.answer}
            </div>
        `;
    });
}

loadDatabase();
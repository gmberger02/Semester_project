/* function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;
    messageElement.classList.remove("form__message--success", "form__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}
 */
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    /* document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });
 */
    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        // Perform your AJAX/Fetch login

        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});

/* dette er bare en test for å se om vi får fjerna eller gjemt */
/* denne styrere legs knappen */
/* dette gjør det mulig at select excersise knappene blir gjemt og de valgte øvelsene blir vist. */

document.addEventListener("DOMContentLoaded", () => {//legger til en event lytter til DOMContentLoaded
    //Definerer et array av objekter, hver representerer en øvelsesknapp, valg av øvelser og en liste over de valgte øvelsene.
    const exercises = [
        { buttonId: "#linkSelectExerciseLegs", selectExerciseId: "#selectExerciseLegs", exerciseFormId: "#selectedLegs" },
        { buttonId: "#linkSelectExerciseCore", selectExerciseId: "#selectExerciseCore", exerciseFormId: "#selectedCore" },
        { buttonId: "#linkSelectExercisePull", selectExerciseId: "#selectExercisePull", exerciseFormId: "#selectedPull" },
        { buttonId: "#linkSelectExercisePush", selectExerciseId: "#selectExercisePush", exerciseFormId: "#selectedPush" }
    ];

    //Går gjennom hvert øvelses ovjekt i exercises-arryet
    exercises.forEach(exercise => {
        // Henter referanser til kanppene, valgav øvelser og viser listen for de valgte øvelsene
        const button = document.querySelector(exercise.buttonId);
        const selectExercise = document.querySelector(exercise.selectExerciseId);
        const exerciseForm = document.querySelector(exercise.exerciseFormId);

        //Legger til en klikk-lytter til kanppen.
        button.addEventListener("click", e => {
            e.preventDefault(); // forhinderer standarhandlingen for klikk på en lenke/knapp

            //Skjuler kanppene og lister for andre øvelser utenom den som brukeren har valgt
            exercises.forEach(otherExercise => {
                if (otherExercise !== exercise) {
                    const otherSelectExercise = document.querySelector(otherExercise.selectExerciseId);
                    const otherExerciseForm = document.querySelector(otherExercise.exerciseFormId);
                    otherSelectExercise.classList.add("form--hidden");
                    otherExerciseForm.classList.add("form--hidden");
                }
            });
            //Viser valg det brukeren valgte av øvelse og liste for øvelse
            selectExercise.classList.add("form--hidden"); // Skjul valg av øvelses-skjema
            exerciseForm.classList.remove("form--hidden"); // Viser øvelses-skjema
        });
    });
});


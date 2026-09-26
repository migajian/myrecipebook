let currentRecipe = recipes[0];

const savedRecipe = localStorage.getItem(
  "myRecipeBook_" + currentRecipe.id
);

if (savedRecipe) {
  currentRecipe = JSON.parse(savedRecipe);
}

// Keep category information updated from recipes.js
currentRecipe.category = recipes[0].category;

// Remove old recipe type system
delete currentRecipe.type;

// Update the saved copy with the new category system
localStorage.setItem(
  "myRecipeBook_" + currentRecipe.id,
  JSON.stringify(currentRecipe)
);

// Recipe title
document.getElementById("recipeName").textContent =
  currentRecipe.name.en;

document.getElementById("recipeNameZh").textContent =
  currentRecipe.name.zh;


// Recipe categories
const recipeTags = document.getElementById("recipeTags");

recipeTags.innerHTML = `
  <span class="tag">
    ${currentRecipe.category.icon}
    ${currentRecipe.category.en}
    ${currentRecipe.category.zh}
  </span>
`;


// Recipe method
const methodList = document.getElementById("methodList");

currentRecipe.method.forEach(function (step, index) {

  const stepCard = document.createElement("div");
  stepCard.className = "step";

  stepCard.innerHTML = `
    <span class="step-number">${index + 1}</span>
    ${step.en}

    <span class="step-cn">
      ${step.zh}
    </span>
  `;

  methodList.appendChild(stepCard);

});

const ingredientsList = document.getElementById("ingredientsList");

currentRecipe.ingredients.forEach(function (ingredient) {

  const ingredientRow = document.createElement("div");
  ingredientRow.className = "ingredient";

  let amountText = "";

  if (ingredient.amount !== null) {
    amountText = `${ingredient.amount} ${ingredient.unit}`;
  }

  ingredientRow.innerHTML = `
    <input type="checkbox">

    <span class="ingredient-name">
      ${amountText ? amountText + " " : ""}
      ${ingredient.en}
    </span>

    <span class="ingredient-cn">
      ${ingredient.zh}
    </span>
  `;

  ingredientsList.appendChild(ingredientRow);

});

const adjustButton = document.getElementById("adjustButton");
const adjustPanel = document.getElementById("adjustPanel");
const closeAdjust = document.getElementById("closeAdjust");

adjustButton.addEventListener("click", function () {
  adjustPanel.classList.add("open");
});

closeAdjust.addEventListener("click", function () {
  adjustPanel.classList.remove("open");
});

const servingsOption = document.getElementById("servingsOption");
const scaleOption = document.getElementById("scaleOption");
const useWhatIHave = document.getElementById("useWhatIHave");
const adjustContent = document.getElementById("adjustContent");


function recipeHasQuantities() {

  const scalableIngredients = currentRecipe.ingredients.filter(
    function (ingredient) {
      return ingredient.unit !== "as-needed";
    }
  );

  if (scalableIngredients.length === 0) {
    return false;
  }

  return scalableIngredients.every(function (ingredient) {
    return ingredient.amount !== null;
  });

}


function showMissingQuantities() {
  adjustContent.innerHTML = `
    <div class="quantity-message">

      <strong>
        Ingredient quantities haven't been added yet.
      </strong>

      <p>
        Add quantities to this recipe before using recipe scaling.
      </p>

      <div class="quantity-message-cn">
        此食譜尚未加入食材份量。<br>
        加入份量後即可調整食譜比例。
      </div>

    </div>
  `;
}


servingsOption.addEventListener("click", function () {

  if (!recipeHasQuantities()) {
    showMissingQuantities();
    return;
  }

});


scaleOption.addEventListener("click", function () {

  if (!recipeHasQuantities()) {
    showMissingQuantities();
    return;
  }

  adjustContent.innerHTML = `
    <div class="scale-panel">

      <strong>Scale Recipe / 調整倍數</strong>

      <p>Choose how much of the recipe you want to make.</p>

      <div class="scale-buttons">
        <button data-scale="0.5">½×</button>
        <button data-scale="1">1×</button>
        <button data-scale="1.5">1.5×</button>
        <button data-scale="2">2×</button>
        <button data-scale="3">3×</button>
      </div>

      <label class="custom-scale-label">
        Custom / 自訂倍數
      </label>

      <input
        type="number"
        id="customScale"
        min="0.1"
        step="0.1"
        placeholder="e.g. 1.25"
      >

      <button class="calculate-scale-button" id="customScaleButton">
        Calculate / 計算
      </button>

      <div id="scaleResult"></div>

    </div>
  `;

  document
    .querySelectorAll("[data-scale]")
    .forEach(function (button) {

      button.addEventListener("click", function () {
        showScaledRecipe(Number(button.dataset.scale));
      });

    });


  document
    .getElementById("customScaleButton")
    .addEventListener("click", function () {

      const scale =
        Number(document.getElementById("customScale").value);

      if (scale > 0) {
        showScaledRecipe(scale);
      }

    });

});

function showScaledRecipe(scale) {

  const result = document.getElementById("scaleResult");

  let html = `
    <div class="scaled-result">

      <h3>
        ${scale}× Recipe / ${scale}倍食譜
      </h3>
  `;


  currentRecipe.ingredients.forEach(function (ingredient) {

    if (ingredient.unit === "as-needed") {

      html += `
        <div class="scaled-ingredient">
          <span>${ingredient.en} · ${ingredient.zh}</span>
          <strong>As needed · 適量</strong>
        </div>
      `;

      return;
    }


    const newAmount =
      ingredient.amount * scale;


    html += `
      <div class="scaled-ingredient">

        <span>
          ${ingredient.en} · ${ingredient.zh}
        </span>

        <strong>
          ${formatRecipeNumber(newAmount)}
          ${ingredient.unit}
        </strong>

      </div>
    `;

  });


  html += `</div>`;

  result.innerHTML = html;

}

function formatRecipeNumber(number) {

  if (Number.isInteger(number)) {
    return number;
  }

  return Math.round(number * 100) / 100;

}


useWhatIHave.addEventListener("click", function () {

  if (!recipeHasQuantities()) {
    showMissingQuantities();
    return;
  }

  const scalableIngredients = currentRecipe.ingredients.filter(
    function (ingredient) {
      return (
        ingredient.amount !== null &&
        ingredient.unit !== "as-needed"
      );
    }
  );

  let ingredientOptions = "";

  scalableIngredients.forEach(function (ingredient, index) {

    ingredientOptions += `
      <option value="${index}">
        ${ingredient.en} · ${ingredient.zh}
        — ${ingredient.amount} ${ingredient.unit}
      </option>
    `;

  });


  adjustContent.innerHTML = `
    <div class="use-have-panel">

      <strong>
        🥣 Use What I Have
      </strong>

      <div class="use-have-cn">
        按現有材料調整
      </div>

      <p>
        Choose an ingredient and enter how much you have.
      </p>

      <label>
        Ingredient / 食材
      </label>

      <select id="availableIngredient">
        ${ingredientOptions}
      </select>


      <label>
        Amount available / 現有份量
      </label>

      <input
        type="number"
        id="availableAmount"
        min="0"
        step="any"
        placeholder="Enter amount"
      >


      <button id="calculateAvailable">
        Calculate / 計算
      </button>


      <div id="availableResult"></div>

    </div>
  `;


  document
    .getElementById("calculateAvailable")
    .addEventListener("click", calculateFromAvailable);

});

function calculateFromAvailable() {

  const scalableIngredients = currentRecipe.ingredients.filter(
    function (ingredient) {
      return (
        ingredient.amount !== null &&
        ingredient.unit !== "as-needed"
      );
    }
  );


  const selectedIndex =
    Number(
      document.getElementById("availableIngredient").value
    );


  const availableAmount =
    Number(
      document.getElementById("availableAmount").value
    );


  if (!availableAmount || availableAmount <= 0) {

    document.getElementById("availableResult").innerHTML = `
      <div class="quantity-message">
        Please enter a valid amount.<br>
        請輸入有效份量。
      </div>
    `;

    return;
  }


  const selectedIngredient =
    scalableIngredients[selectedIndex];


  const scale =
    availableAmount / selectedIngredient.amount;


  let html = `
    <div class="available-result">

      <h3>
        Adjusted Recipe / 調整後食譜
      </h3>

      <p>
        Based on
        <strong>
          ${availableAmount} ${selectedIngredient.unit}
          ${selectedIngredient.en}
        </strong>
      </p>

      <p>
        Recipe scale:
        <strong>${formatRecipeNumber(scale)}×</strong>
      </p>
  `;


  currentRecipe.ingredients.forEach(function (ingredient) {

    if (ingredient.unit === "as-needed") {

      html += `
        <div class="scaled-ingredient">

          <span>
            ${ingredient.en} · ${ingredient.zh}
          </span>

          <strong>
            As needed · 適量
          </strong>

        </div>
      `;

      return;
    }


    const adjustedAmount =
      ingredient.amount * scale;


    html += `
      <div class="scaled-ingredient">

        <span>
          ${ingredient.en} · ${ingredient.zh}
        </span>

        <strong>
          ${formatRecipeNumber(adjustedAmount)}
          ${ingredient.unit}
        </strong>

      </div>
    `;

  });


  html += `</div>`;

  document.getElementById("availableResult").innerHTML = html;

}

const editRecipeButton = document.getElementById("editRecipeButton");
const editPanel = document.getElementById("editPanel");
const closeEdit = document.getElementById("closeEdit");
const editMethod = document.getElementById("editMethod");
const addStepButton = document.getElementById("addStepButton");

const editNameEn = document.getElementById("editNameEn");
const editNameZh = document.getElementById("editNameZh");

const editIngredients = document.getElementById("editIngredients");


editRecipeButton.addEventListener("click", function () {

  editPanel.classList.add("open");

  editNameEn.value = currentRecipe.name.en;
  editNameZh.value = currentRecipe.name.zh;

  buildIngredientEditor();
  buildMethodEditor();

});


closeEdit.addEventListener("click", function () {
  editPanel.classList.remove("open");
});


function buildIngredientEditor() {

  editIngredients.innerHTML = "";

  currentRecipe.ingredients.forEach(function (ingredient, index) {

    const row = document.createElement("div");
    row.className = "edit-ingredient-row";

    row.innerHTML = `

      <div class="edit-ingredient-names">

        <input
          type="text"
          value="${ingredient.en}"
          data-index="${index}"
          data-field="en"
          placeholder="Ingredient"
        >

        <input
          type="text"
          value="${ingredient.zh}"
          data-index="${index}"
          data-field="zh"
          placeholder="食材"
        >

      </div>


      <div class="edit-ingredient-quantity">

        <input
          type="number"
          value="${ingredient.amount ?? ""}"
          data-index="${index}"
          data-field="amount"
          placeholder="Amount"
          min="0"
          step="any"
        >


        <select
          data-index="${index}"
          data-field="unit"
        >

          <option value="">Unit / 單位</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="L">L</option>
          <option value="tsp">tsp</option>
          <option value="tbsp">tbsp</option>
          <option value="cup">cup</option>
          <option value="piece">piece</option>
          <option value="clove">clove</option>
          <option value="bunch">bunch</option>
          <option value="as-needed">As needed / 適量</option>

        </select>

      </div>

            <button
        type="button"
        class="delete-ingredient-button"
        data-delete-index="${index}"
      >
        🗑 Remove / 刪除
      </button>

    `;

    editIngredients.appendChild(row);

    row.querySelector("select").value = ingredient.unit;

  });

}

const saveRecipeButton = document.getElementById("saveRecipeButton");

saveRecipeButton.addEventListener("click", function () {
 saveMethodEditor();
  // Save recipe names
  currentRecipe.name.en = editNameEn.value.trim();
  currentRecipe.name.zh = editNameZh.value.trim();

  // Save ingredient edits
  const ingredientRows =
    editIngredients.querySelectorAll(".edit-ingredient-row");

  ingredientRows.forEach(function (row, index) {

    const enInput =
      row.querySelector('[data-field="en"]');

    const zhInput =
      row.querySelector('[data-field="zh"]');

    const amountInput =
      row.querySelector('[data-field="amount"]');

    const unitSelect =
      row.querySelector('[data-field="unit"]');

    currentRecipe.ingredients[index].en =
      enInput.value.trim();

    currentRecipe.ingredients[index].zh =
      zhInput.value.trim();

    currentRecipe.ingredients[index].amount =
      amountInput.value === ""
        ? null
        : Number(amountInput.value);

    currentRecipe.ingredients[index].unit =
      unitSelect.value;

  });

  // Store the edited recipe on this device
  localStorage.setItem(
    "myRecipeBook_" + currentRecipe.id,
    JSON.stringify(currentRecipe)
  );

  // Update what is shown on the page
  refreshRecipeDisplay();

  // Close editor
  editPanel.classList.remove("open");

  alert("Recipe saved! / 食譜已儲存 🌿");

});

function refreshRecipeDisplay() {

  // Update names
  document.getElementById("recipeName").textContent =
    currentRecipe.name.en;

  document.getElementById("recipeNameZh").textContent =
    currentRecipe.name.zh;


  // Rebuild ingredients
  ingredientsList.innerHTML = "";

  currentRecipe.ingredients.forEach(function (ingredient) {

    const row = document.createElement("div");
    row.className = "ingredient";

    let amountText = "";

   if (ingredient.unit === "as-needed") {

  amountText = "As needed · 適量";

} else if (ingredient.amount !== null) {

  amountText =
    ingredient.amount +
    (ingredient.unit ? " " + ingredient.unit : "");

}

    row.innerHTML = `
      <input type="checkbox">

      <span class="ingredient-name">
        ${amountText ? amountText + " " : ""}
        ${ingredient.en}
      </span>

      <span class="ingredient-cn">
        ${ingredient.zh}
      </span>
    `;

    ingredientsList.appendChild(row);

  });
methodList.innerHTML = "";

currentRecipe.method.forEach(function (step, index) {

  const stepCard = document.createElement("div");
  stepCard.className = "step";

  stepCard.innerHTML = `
    <span class="step-number">${index + 1}</span>

    <div class="step-text">
      <div>${step.en}</div>
      <div class="step-cn">${step.zh}</div>
    </div>
  `;

  methodList.appendChild(stepCard);

});

}

const addIngredientButton =
  document.getElementById("addIngredientButton");


addIngredientButton.addEventListener("click", function () {

  saveEditorToRecipe();

  currentRecipe.ingredients.push({
    en: "",
    zh: "",
    amount: null,
    unit: ""
  });

  buildIngredientEditor();

});

editIngredients.addEventListener("click", function (event) {

  const deleteButton =
    event.target.closest(".delete-ingredient-button");

  if (!deleteButton) {
    return;
  }

  saveEditorToRecipe();

  const index =
    Number(deleteButton.dataset.deleteIndex);

  currentRecipe.ingredients.splice(index, 1);

  buildIngredientEditor();

});

function saveEditorToRecipe() {

  const rows =
    editIngredients.querySelectorAll(".edit-ingredient-row");

  rows.forEach(function (row, index) {

    if (!currentRecipe.ingredients[index]) {
      return;
    }

    const enInput =
      row.querySelector('[data-field="en"]');

    const zhInput =
      row.querySelector('[data-field="zh"]');

    const amountInput =
      row.querySelector('[data-field="amount"]');

    const unitSelect =
      row.querySelector('[data-field="unit"]');


    currentRecipe.ingredients[index].en =
      enInput.value.trim();

    currentRecipe.ingredients[index].zh =
      zhInput.value.trim();

    currentRecipe.ingredients[index].amount =
      amountInput.value === ""
        ? null
        : Number(amountInput.value);

    currentRecipe.ingredients[index].unit =
      unitSelect.value;

  });

}

function buildMethodEditor() {

  editMethod.innerHTML = "";

  currentRecipe.method.forEach(function (step, index) {

    const row = document.createElement("div");
    row.className = "edit-step-row";

    row.innerHTML = `
      <div class="edit-step-number">
        Step ${index + 1} / 步驟 ${index + 1}
      </div>

      <textarea
        data-step-index="${index}"
        data-step-field="en"
        placeholder="Method in English"
      >${step.en}</textarea>

      <textarea
        data-step-index="${index}"
        data-step-field="zh"
        placeholder="中文步驟"
      >${step.zh}</textarea>

      <button
        type="button"
        class="delete-step-button"
        data-delete-step="${index}"
      >
        🗑 Remove Step / 刪除步驟
      </button>
    `;

    editMethod.appendChild(row);

  });

}

addStepButton.addEventListener("click", function () {

  saveMethodEditor();

  currentRecipe.method.push({
    en: "",
    zh: ""
  });

  buildMethodEditor();

});

function saveMethodEditor() {

  const rows =
    editMethod.querySelectorAll(".edit-step-row");

  rows.forEach(function (row, index) {

    if (!currentRecipe.method[index]) {
      return;
    }

    const enInput =
      row.querySelector('[data-step-field="en"]');

    const zhInput =
      row.querySelector('[data-step-field="zh"]');

    currentRecipe.method[index].en =
      enInput.value.trim();

    currentRecipe.method[index].zh =
      zhInput.value.trim();

  });

}

editMethod.addEventListener("click", function (event) {

  const deleteButton =
    event.target.closest(".delete-step-button");

  if (!deleteButton) {
    return;
  }

  saveMethodEditor();

  const index =
    Number(deleteButton.dataset.deleteStep);

  currentRecipe.method.splice(index, 1);

  buildMethodEditor();

});


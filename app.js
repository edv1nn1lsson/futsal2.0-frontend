document.addEventListener("DOMContentLoaded", function () {
  const playerListContainer = document.getElementById("player-list");
  const teamListContainer = document.getElementById("team-list");
  const generateTeamsButton = document.getElementById("generate-teams-button");
  const clearSelectionButton = document.getElementById(
    "clear-selection-button"
  );
  const selectAllCheckbox = document.getElementById("select-all");
  const overlay = document.getElementById("overlay");
  const overlayImage = overlay.querySelector("img");

  const gifImages = [
    "images/boca-futsal-santiago-basile.gif",
    "images/falcao-matador-break-leg.gif",
    "images/futsal-goal-rbfa.gif",
    "images/futsal-kick.gif",
    "images/indoor-soccer.gif",
    "images/kick-soccer.gif",
  ];

  // Hämta spelare från endpoint
  function fetchPlayers() {
    axios
      .get("http://localhost:8080/players")
      .then((response) => {
        const players = response.data;
        renderPlayers(players);
        resetCheckboxes(); // Återställ checkboxar när spelare har renderats
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
      });
  }

  // Visa spelare i lista med checkboxar
  function renderPlayers(players) {
    playerListContainer.innerHTML = "";

    const half = Math.ceil(players.length / 2);
    const firstHalf = players.slice(0, half);
    const secondHalf = players.slice(half);

    const col1 = document.createElement("div");
    col1.className = "col-md-6";
    const col2 = document.createElement("div");
    col2.className = "col-md-6";

    firstHalf.forEach((player) => {
      const playerDiv = document.createElement("div");
      playerDiv.className = "form-check";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = player.id;
      checkbox.className = "form-check-input me-2";

      const label = document.createElement("label");
      label.className = "form-check-label";
      label.textContent = player.name;
      label.prepend(checkbox);

      playerDiv.appendChild(label);
      col1.appendChild(playerDiv);
    });

    secondHalf.forEach((player) => {
      const playerDiv = document.createElement("div");
      playerDiv.className = "form-check";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = player.id;
      checkbox.className = "form-check-input me-2";

      const label = document.createElement("label");
      label.className = "form-check-label";
      label.textContent = player.name;
      label.prepend(checkbox);

      playerDiv.appendChild(label);
      col2.appendChild(playerDiv);
    });

    playerListContainer.appendChild(col1);
    playerListContainer.appendChild(col2);
  }

  // Skapa lag
  generateTeamsButton.addEventListener("click", function () {
    const selectedPlayerIds = Array.from(
      playerListContainer.querySelectorAll('input[type="checkbox"]:checked')
    ).map((cb) => Number(cb.value));

    if (selectedPlayerIds.length === 0) {
      renderErrorMessage("Inga spelare valda.");
      return;
    }

    const randomGif = gifImages[Math.floor(Math.random() * gifImages.length)];
    overlayImage.src = randomGif;
    overlay.style.display = "flex";

    teamListContainer.innerHTML = "";

    axios
      .post("http://localhost:8080/teams", selectedPlayerIds)
      .then((response) => {
        const teams = response.data;

        setTimeout(() => {
          overlay.style.display = "none";
          renderTeams(teams);
        }, 3500);
      })
      .catch((error) => {
        console.error("Error generating teams:", error);
      });
  });

  // Välj alla checkboxar
  selectAllCheckbox.addEventListener("change", function () {
    const checkboxes = playerListContainer.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });

  // Återställ alla checkboxar när sidan laddas om
  function resetCheckboxes() {
    const checkboxes = playerListContainer.querySelectorAll(
      'input[type="checkbox"]'
    );
    // Återställ alla checkboxar till avmarkerat läge
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    // Återställ "Välj alla" checkboxen till avmarkerat läge
    selectAllCheckbox.checked = false;
  }

  // Visa lag
  function renderTeams(teams) {
    teamListContainer.innerHTML = "";
    for (let [teamName, players] of Object.entries(teams)) {
      const teamCard = document.createElement("div");
      teamCard.className = "col-md-6 mb-3";

      const card = document.createElement("div");
      card.className = "card";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const cardTitle = document.createElement("h5");
      cardTitle.className = "card-title";
      cardTitle.textContent = teamName;

      const playerList = document.createElement("ul");
      playerList.className = "list-unstyled";
      players.forEach((player) => {
        const playerItem = document.createElement("li");
        playerItem.textContent = player.name;
        playerList.appendChild(playerItem);
      });

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(playerList);
      card.appendChild(cardBody);
      teamCard.appendChild(card);
      teamListContainer.appendChild(teamCard);
    }
  }

  clearSelectionButton.addEventListener("click", function () {
    const checkboxes = playerListContainer.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    selectAllCheckbox.checked = false;
    teamListContainer.innerHTML = "";
  });

  // Felmeddelande
  function renderErrorMessage(message) {
    teamListContainer.innerHTML = "";
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger custom-alert";
    errorDiv.textContent = message;
    teamListContainer.appendChild(errorDiv);
  }

  fetchPlayers();
});
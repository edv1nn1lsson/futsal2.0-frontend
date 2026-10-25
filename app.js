document.addEventListener("DOMContentLoaded", function () {
  const playerListContainer = document.getElementById("player-list");
  const tempPlayerModalElement = document.getElementById("temp-player-modal");
  const tempPlayerModal = bootstrap.Modal.getOrCreateInstance(
    tempPlayerModalElement,
  );
  const tempPlayerForm = document.getElementById("temp-player-form");
  const tempNameInput = document.getElementById("temp-name");
  const tempSkillInput = document.getElementById("temp-skill");
  const tempPlayerError = document.getElementById("temp-player-error");
  const teamListContainer = document.getElementById("team-list");
  const teamSection = document.getElementById("team-section");
  const generateTeamsButton = document.getElementById("generate-teams-button");
  const clearSelectionButton = document.getElementById(
    "clear-selection-button",
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

  const usePredefinedTeams = false; // Ändra till true för att använda hårdkodade lag

  const predefinedTeams = [
    {
      name: "Lag svart",
      players: [
        { name: "Richard" },
        { name: "Michael A" },
        { name: "Philip" },
        { name: "Johan M" },
        { name: "Peter" },
      ],
    },
    {
      name: "Lag vit",
      players: [
        { name: "Edvin" },
        { name: "Tommy" },
        { name: "Per" },
        { name: "Joakim S" },
        { name: "David" },
      ],
    },
  ];

  const API_BASE_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === ""
      ? "http://localhost:8080"
      : "https://futsal2-0-backend.onrender.com";

  let players = [];
  // Tillfälliga spelare lever bara i minnet så länge sidan är öppen.
  // De får negativa id:n så att backend kan skilja dem från ordinarie spelare.
  let tempPlayers = [];
  let nextTempId = -1;

  function allCheckboxes() {
    return Array.from(
      playerListContainer.querySelectorAll('input[type="checkbox"]'),
    );
  }

  // Hämta spelare från endpoint
  function fetchPlayers() {
    axios
      .get(`${API_BASE_URL}/players`)
      .then((response) => {
        players = response.data;
        renderPlayers();
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
      });
  }

  // Ordinarie + tillfälliga spelare i bokstavsordning
  function getAllPlayersSorted() {
    return [...players, ...tempPlayers].sort((a, b) =>
      a.name.localeCompare(b.name, "sv"),
    );
  }

  function createPlayerItem(player, checked) {
    const isTemp = player.id < 0;

    const playerDiv = document.createElement("div");
    playerDiv.className = isTemp
      ? "form-check d-flex justify-content-between align-items-center"
      : "form-check";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = player.id;
    checkbox.checked = checked;
    checkbox.className = "form-check-input me-2";

    const label = document.createElement("label");
    label.className = "form-check-label";
    label.textContent = player.name;
    label.prepend(checkbox);

    playerDiv.appendChild(label);

    if (isTemp) {
      label.classList.add("fst-italic");
      label.title = "Tillfällig spelare";

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className =
        "btn btn-link btn-sm text-danger text-decoration-none p-0 ms-2";
      removeButton.textContent = "✕";
      removeButton.setAttribute("aria-label", `Ta bort ${player.name}`);
      removeButton.addEventListener("click", function () {
        tempPlayers = tempPlayers.filter((p) => p.id !== player.id);
        renderPlayers();
      });
      playerDiv.appendChild(removeButton);
    }

    return playerDiv;
  }

  // Visa spelare i lista med checkboxar. Behåller nuvarande val vid omritning.
  function renderPlayers(extraCheckedId = null) {
    const checkedIds = new Set(
      allCheckboxes()
        .filter((cb) => cb.checked)
        .map((cb) => Number(cb.value)),
    );
    if (extraCheckedId !== null) {
      checkedIds.add(extraCheckedId);
    }

    const allPlayers = getAllPlayersSorted();

    playerListContainer.innerHTML = "";

    const half = Math.ceil(allPlayers.length / 2);
    const firstHalf = allPlayers.slice(0, half);
    const secondHalf = allPlayers.slice(half);

    const col1 = document.createElement("div");
    col1.className = "col-6";
    const col2 = document.createElement("div");
    col2.className = "col-6";

    firstHalf.forEach((player) =>
      col1.appendChild(createPlayerItem(player, checkedIds.has(player.id))),
    );
    secondHalf.forEach((player) =>
      col2.appendChild(createPlayerItem(player, checkedIds.has(player.id))),
    );

    playerListContainer.appendChild(col1);
    playerListContainer.appendChild(col2);
  }

  function showTempPlayerError(message) {
    tempPlayerError.textContent = message;
  }

  // Overlay för tillfällig spelare: fokus på namnfältet när den visas,
  // nollställ formuläret när den stängs.
  // Flytta bort fokus från knappen i modalen innan Bootstrap sätter aria-hidden
  // på den, annars varnar webbläsaren. Bootstrap återställer fokus till
  // "+ Spelare"-knappen efter att modalen stängts.
  tempPlayerModalElement.addEventListener("hide.bs.modal", function () {
    if (tempPlayerModalElement.contains(document.activeElement)) {
      document.activeElement.blur();
    }
  });
  tempPlayerModalElement.addEventListener("shown.bs.modal", function () {
    tempNameInput.focus();
  });
  tempPlayerModalElement.addEventListener("hidden.bs.modal", function () {
    tempPlayerForm.reset();
    showTempPlayerError("");
  });

  // Lägg till tillfällig spelare
  tempPlayerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = tempNameInput.value.trim();
    const skill = Number(tempSkillInput.value);
    const positionInput = tempPlayerForm.querySelector(
      'input[name="temp-position"]:checked',
    );

    if (!name) {
      showTempPlayerError("Ange ett namn.");
      return;
    }
    if (!Number.isInteger(skill) || skill < 1 || skill > 100) {
      showTempPlayerError("Skill måste vara ett heltal mellan 1 och 100.");
      return;
    }
    if (!positionInput) {
      showTempPlayerError("Välj position.");
      return;
    }

    const player = {
      id: nextTempId--,
      name: name,
      position: positionInput.value,
      skill: skill,
    };
    tempPlayers.push(player);
    renderPlayers(player.id); // Förkryssad och inplacerad i bokstavsordning
    tempPlayerModal.hide();
  });

  // Skapa lag
  generateTeamsButton.addEventListener("click", function () {
    const selectedPlayerIds = allCheckboxes()
      .filter((cb) => cb.checked)
      .map((cb) => Number(cb.value));

    if (selectedPlayerIds.length === 0 && !usePredefinedTeams) {
      renderErrorMessage("Inga spelare valda.");
      return;
    }
    if (selectedPlayerIds.length < 2 && !usePredefinedTeams) {
      renderErrorMessage("Välj minst två spelare.");
      return;
    }

    // Ordinarie spelare skickas bara som id. Tillfälliga skickas med alla fält.
    const selectedPlayers = selectedPlayerIds.map((id) =>
      id > 0 ? { id: id } : tempPlayers.find((p) => p.id === id),
    );

    const randomGif = gifImages[Math.floor(Math.random() * gifImages.length)];
    overlayImage.src = randomGif;
    overlay.style.display = "flex";

    teamListContainer.innerHTML = "";

    if (usePredefinedTeams) {
      // Använd hårdkodade lag
      setTimeout(() => {
        overlay.style.display = "none";
        renderTeams(predefinedTeams);
      }, 3500);
    } else {
      // Använd backend för laggenerering
      axios
        .post(`${API_BASE_URL}/teams`, selectedPlayers)
        .then((response) => {
          const teams = response.data;

          setTimeout(() => {
            overlay.style.display = "none";
            renderTeams(teams);
          }, 3500);
        })
        .catch((error) => {
          console.error("Error generating teams:", error);
          overlay.style.display = "none";
          renderErrorMessage(getErrorMessage(error));
        });
    }
  });

  function getErrorMessage(error) {
    if (error.response) {
      const data = error.response.data;
      if (typeof data === "string" && data.length > 0) {
        return `Kunde inte skapa lag: ${data}`;
      }
      return `Servern svarade med fel (${error.response.status}).`;
    }
    return "Kunde inte nå servern. Försök igen om en stund.";
  }

  // Välj alla checkboxar
  selectAllCheckbox.addEventListener("change", function () {
    allCheckboxes().forEach((checkbox) => {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });

  // Visa lag
  function renderTeams(teams) {
    teamListContainer.innerHTML = "";
    teamSection.classList.remove("is-hidden-mobile");
    teams.forEach((team) => {
      const teamCard = document.createElement("div");
      teamCard.className = "col-md-6 mb-3";

      const card = document.createElement("div");
      card.className = "card";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const cardTitle = document.createElement("h5");
      cardTitle.className = "card-title text-center text-md-start";
      cardTitle.textContent = team.name;

      const playerList = document.createElement("ul");
      playerList.className = "list-unstyled text-center text-md-start";
      team.players.forEach((player) => {
        const playerItem = document.createElement("li");
        playerItem.textContent = player.name;
        playerList.appendChild(playerItem);
      });

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(playerList);
      card.appendChild(cardBody);
      teamCard.appendChild(card);
      teamListContainer.appendChild(teamCard);
    });
  }

  // Återställ alla checkboxar
  clearSelectionButton.addEventListener("click", function () {
    allCheckboxes().forEach((checkbox) => {
      checkbox.checked = false;
    });
    selectAllCheckbox.checked = false;
    teamListContainer.innerHTML = "";
    teamSection.classList.add("is-hidden-mobile");
  });

  // Felmeddelande
  function renderErrorMessage(message) {
    teamListContainer.innerHTML = "";
    // Annars syns felet inte i mobilläge när lagsektionen är dold
    teamSection.classList.remove("is-hidden-mobile");
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger custom-alert";
    errorDiv.textContent = message;
    teamListContainer.appendChild(errorDiv);
  }

  fetchPlayers();
  teamSection.classList.add("is-hidden-mobile");
});

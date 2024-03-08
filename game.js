function randomizeArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getKeyString(x, y) {
  return `${x},${y}`;
}
function rotateImage(image, direction) {
  switch (direction) {
    case "right":
      image.style.transform = "scaleX(1)";
      break;
    case "left":
      image.style.transform = "scaleX(-1)";
      break;
  }
}

function randomName() {
  const first = randomizeArray([
    "Dope",
    "Cool",
    "Rad",
    "Epic",
    "Awesome",
    "Amazing",
    "Great",
    "Super",
    "Fantastic",
    "Wonderful",
  ]);
  const second = randomizeArray([
    "Wolf",
    "Bear",
    "Tiger",
    "Lion",
    "Eagle",
    "Hawk",
    "Snake",
    "Shark",
    "Duck",
    "Goose",
  ]);
  return `${first} ${second}`;
}

function randomColor() {
  const colors = randomizeArray([
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "black",
    "white",
    "gray",
    "brown",
    "pink",
    "cyan",
    "magenta",
    "lime",
    "olive",
  ]);
  return colors;
}

function getRandomSafeSpot() {
  //We don't look things up by key here, so just return an x/y
  return randomizeArray([
    { x: 1, y: 4 },
    { x: 2, y: 4 },
    { x: 1, y: 5 },
    { x: 2, y: 6 },
    { x: 2, y: 8 },
    { x: 2, y: 9 },
    { x: 4, y: 8 },
    { x: 5, y: 5 },
    { x: 5, y: 8 },
    { x: 5, y: 10 },
    { x: 5, y: 11 },
    { x: 11, y: 7 },
    { x: 12, y: 7 },
    { x: 13, y: 7 },
    { x: 13, y: 6 },
    { x: 13, y: 8 },
    { x: 7, y: 6 },
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 8, y: 8 },
    { x: 10, y: 8 },
    { x: 8, y: 8 },
    { x: 11, y: 4 },
  ]);
}

let currentFloorNumber = 0;

function spawnStartPortal() {
  const container = document.querySelector(".game-container");

  if (currentFloorNumber === 0) {
    //remove the old portals
    const oldPortals = document.querySelectorAll(".portal");
    oldPortals.forEach((oldPortal) => {
      oldPortal.remove();
    });
    const xPosition = 15;
    const yPosition = -1;
    const portal = document.createElement("div");
    portal.classList.add("portal");
    portal.style.transform = `translate3d(${xPosition * 16}px, ${
      yPosition * 16
    }px, 0)`;
    container.appendChild(portal);
  } else if (currentFloorNumber % 2 === 0) {
    //remove the old portal
    const oldPortals = document.querySelectorAll(".portal");
    oldPortals.forEach((oldPortal) => {
      oldPortal.remove();
    });
    const xPositions = [10, 20];
    const yPosition = -1;
    xPositions.forEach((xPosition) => {
      const portal = document.createElement("div");
      portal.classList.add("portal");
      portal.style.transform = `translate3d(${xPosition * 16}px, ${
        yPosition * 16
      }px, 0)`;
      container.appendChild(portal);
    });
  } else if (currentFloorNumber % 2 !== 0) {
    //remove the old portals
    const oldPortals = document.querySelectorAll(".portal");
    oldPortals.forEach((oldPortal) => {
      oldPortal.remove();
    });
    const xPositions = [10, 20];
    const yPosition = 12;
    xPositions.forEach((xPosition) => {
      const portal = document.createElement("div");
      portal.classList.add("portal");
      portal.style.transform = `translate3d(${xPosition * 16}px, ${
        yPosition * 16
      }px, 0)`;
      container.appendChild(portal);
    });
  }
}

function updateFloorAppearance(floorNumber) {
  const gameContainer = document.querySelector(".game-container");
  const body = document.querySelector("body");
  spawnStartPortal();
  if (floorNumber !== 0) {
    gameContainer.style.backgroundImage = `url('floor.png')`;
    body.style.backgroundColor = "black";
  } else {
    gameContainer.style.backgroundImage = `url('background.png')`;
    body.style.backgroundColor = "#38a2d0";
  }
}

function filterPlayersByFloor(floorNumber, players) {
  const filteredPlayers = {};
  for (const playerId in players) {
    if (players[playerId].floor === floorNumber) {
      filteredPlayers[playerId] = players[playerId];
    }
  }
  return filteredPlayers;
}

//nomad = starter class
//warrior = tank
//mage = magic user
//assassin = stealth
//healer = support
//archer = ranged
classesArray = ["nomad", "warrior", "mage", "assassin", "archer"];

(function () {
  let playerId;
  let playerRef;
  let players = {};
  let playerElements = {};

  const gameContainer = document.querySelector(".game-container");
  spawnStartPortal();
  function handleArrowPress(xChange = 0, yChange = 0) {
    const oldX = players[playerId].x;
    const oldY = players[playerId].y;
    const newX = oldX + xChange;
    const newY = oldY + yChange;

    //check if the new position is in the game-container
    if (newX < 0 || newX >= 62 || newY < 0 || newY >= 27) {
      return;
    }

    // make text in the top middle of the screen where you can see your current floor
    const floorText = document.querySelector(".floor-text");
    if (floorText) {
      if (currentFloorNumber == 0) {
        floorText.innerHTML = `Welcome to the dungeon! Enter the portal to start your adventure!`;
      } else {
        floorText.innerHTML = `Floor: ${currentFloorNumber}`;
      }
    }

    // Check if position will change
    if (oldX !== newX || oldY !== newY) {
      players[playerId].x = newX;
      players[playerId].y = newY;
      if (xChange > 0) {
        players[playerId].direction = "right";
      }
      if (xChange < 0) {
        players[playerId].direction = "left";
      }
      playerRef.set(players[playerId]); // Update Firebase with the new position
    }
  }

  // Initialize KeyPressListener
  const keyPressListenerUp = new KeyPressListener("ArrowUp", () =>
    handleArrowPress(0, -1)
  );
  const keyPressListenerDown = new KeyPressListener("ArrowDown", () =>
    handleArrowPress(0, 1)
  );
  const keyPressListenerLeft = new KeyPressListener("ArrowLeft", () =>
    handleArrowPress(-1, 0)
  );
  const keyPressListenerRight = new KeyPressListener("ArrowRight", () =>
    handleArrowPress(1, 0)
  );

  function initGame() {
    //WASD
    new KeyPressListener("KeyW", () => handleArrowPress(0, -1));
    new KeyPressListener("KeyA", () => handleArrowPress(-1, 0));
    new KeyPressListener("KeyS", () => handleArrowPress(0, 1));
    new KeyPressListener("KeyD", () => handleArrowPress(1, 0));

    const allPlayerRef = firebase.database().ref("players");

    allPlayerRef.on("value", (snapshot) => {
      // when change occurs
      players = snapshot.val() || {};

      //filter the players by floor
      const filteredPlayers = filterPlayersByFloor(currentFloorNumber, players);
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        let el = playerElements[key];
        el.querySelector(".Character_name").innerHTML = characterState.name;
        el.querySelector(".Character_level").innerHTML = characterState.level;
        switch (characterState.class) {
          case "nomad":
            el.querySelector(".Character_sprite").style.backgroundImage =
              "url('nomad.png')";
            break;
          case "warrior":
            el.querySelector(".Character_sprite").style.backgroundImage =
              "url('warrior.png')";
            break;
          case "mage":
            el.querySelector(".Character_sprite").style.backgroundImage =
              "url('mage.png')";
            break;
          case "assassin":
            el.querySelector(".Character_sprite").style.backgroundImage =
              "url('assassin.png')";
            break;
          case "archer":
            el.querySelector(".Character_sprite").style.backgroundImage =
              "url('archer.png')";
            break;
          default:
            console.error("Unknown player class:", characterState.class);
            break;
        }
        rotateImage(
          el.querySelector(".Character_sprite"),
          characterState.direction
        );
        const left = 16 * characterState.x + "px";
        const top = 16 * characterState.y - 4 + "px";
        el.style.transform = `translate3d(${left}, ${top}, 0)`;

        // make players not on the same floor invisible
        if (characterState.floor !== currentFloorNumber) {
          el.style.display = "none";
        } else {
          el.style.display = "block";
        }

        // Update the health bar
        const healthBarFill = el.querySelector(".Character_health-bar-fill");
        healthBarFill.style.width = `${characterState.health}%`;

        // Update the xp bar
        const xpBarFill = el.querySelector(".Character_xp-bar-fill");
        xpBarFill.style.width = `${(characterState.xp / 100) * 100}%`;

        //check if player if in the portal
        if (
          characterState.x >= 29 &&
          characterState.x <= 31 &&
          characterState.y === 0 &&
          characterState.floor === 0
        ) {
          //only send the player that is me to the next floor
          if (key === playerId) {
            currentFloorNumber++;
            playerRef.update({ floor: currentFloorNumber });
            updateFloorAppearance(currentFloorNumber);
          }
        }
        if (
          characterState.x >= 19 &&
          characterState.x <= 21 &&
          characterState.y === 0 &&
          characterState.floor % 2 === 0 &&
          characterState.floor !== 0
        ) {
          if (key === playerId) {
            currentFloorNumber--;
            playerRef.update({ floor: currentFloorNumber });
            updateFloorAppearance(currentFloorNumber);
          }
        }
        if (
          characterState.x >= 39 &&
          characterState.x <= 41 &&
          characterState.y === 0 &&
          characterState.floor % 2 === 0 &&
          characterState.floor !== 0
        ) {
          if (key === playerId) {
            currentFloorNumber++;
            playerRef.update({ floor: currentFloorNumber });
            updateFloorAppearance(currentFloorNumber);
          }
        }
        if (
          characterState.x >= 19 &&
          characterState.x <= 21 &&
          characterState.y === 26 &&
          characterState.floor % 2 !== 0
        ) {
          if (key === playerId) {
            currentFloorNumber--;
            playerRef.update({ floor: currentFloorNumber });
            updateFloorAppearance(currentFloorNumber);
          }
        }
        if (
          characterState.x >= 39 &&
          characterState.x <= 41 &&
          characterState.y === 26 &&
          characterState.floor % 2 !== 0
        ) {
          if (key === playerId) {
            currentFloorNumber++;
            playerRef.update({ floor: currentFloorNumber });
            updateFloorAppearance(currentFloorNumber);
          }
        }
      });
    });
    allPlayerRef.on("child_added", (snapshot) => {
      // when a new node is added in the database
      const addedPlayer = snapshot.val();
      const characterElement = document.createElement("div");
      characterElement.classList.add("Character", "grid-cell");

      if (addedPlayer.id === playerId) {
        characterElement.classList.add("my-character");
      }

      characterElement.innerHTML = `
      <div class="Character_shadow grid-cell"></div>
      <div class="Character_sprite grid-cell"></div>
      <div class="Character_name-container">
        <span class="Character_name"></span>
        <span class="Character_level"></span>
      </div>
      <div class="Character_health-bar"><div class="Character_health-bar-fill"></div></div>
      
      <div class="Character_xp-bar"><div class="Character_xp-bar-fill"></div></div>
      
      <div class="Character_you-arrow"></div>
      `;

      playerElements[addedPlayer.id] = characterElement;

      switch (addedPlayer.class) {
        case "nomad":
          characterElement.querySelector(
            ".Character_sprite"
          ).style.backgroundImage = "url('nomad.png')";
          break;
        case "warrior":
          characterElement.querySelector(
            ".Character_sprite"
          ).style.backgroundImage = "url('warrior.png')";
          break;
        case "mage":
          characterElement.querySelector(
            ".Character_sprite"
          ).style.backgroundImage = "url('mage.png')";
          break;
        case "assassin":
          characterElement.querySelector(
            ".Character_sprite"
          ).style.backgroundImage = "url('assassin.png')";
          break;
        case "archer":
          characterElement.querySelector(
            ".Character_sprite"
          ).style.backgroundImage = "url('archer.png')";
          break;
        default:
          // Default case if the class is not recognized
          console.error("Unknown player class:", addedPlayer.class);
          break;
      }

      //fill in the character's data
      characterElement.querySelector(".Character_name").innerHTML =
        addedPlayer.name;
      characterElement.querySelector(".Character_level").innerHTML =
        addedPlayer.level;
      if (characterElement) {
        const left = 16 * addedPlayer.x + "px";
        const top = 16 * addedPlayer.y - 4 + "px";
        characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      }

      gameContainer.appendChild(characterElement);
    });
    allPlayerRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      gameContainer.removeChild(playerElements[removedKey]);
      delete playerElements[removedKey];
    });
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("User is signed in.");

      playerId = user.uid;
      playerRef = firebase.database().ref("players/" + playerId);

      const playerName = randomName();
      const playerColor = randomColor();

      const { x, y } = getRandomSafeSpot();
      // Set the player's initial data
      playerRef.set({
        id: playerId,
        name: playerName,
        x,
        y,
        xp: 0,
        direction: "right",
        class: "nomad",
        floor: 0,
        health: 100,
        level: 1,
      });

      // Remove the player when they disconnect
      playerRef.onDisconnect().remove();

      //begin the game
      initGame();
    } else {
      console.log("User is signed out.");
    }
  });

  firebase
    .auth()
    .signInAnonymously()
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
})();

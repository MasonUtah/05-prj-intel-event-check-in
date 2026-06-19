const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

let count = 0;
const maxCount = 50;

const attendeesByTeam = {
  water: [],
  zero: [],
  power: [],
};

function saveToLocalStorage() {
  localStorage.setItem("checkInCount", JSON.stringify(count));
  localStorage.setItem("attendeesByTeam", JSON.stringify(attendeesByTeam));
}

function loadFromLocalStorage() {
  const savedCount = localStorage.getItem("checkInCount");
  const savedAttendees = localStorage.getItem("attendeesByTeam");

  if (savedCount !== null) {
    count = JSON.parse(savedCount);
  }

  if (savedAttendees !== null) {
    const parsed = JSON.parse(savedAttendees);
    attendeesByTeam.water = parsed.water || [];
    attendeesByTeam.zero = parsed.zero || [];
    attendeesByTeam.power = parsed.power || [];
  }
}

function updateUI() {
  const attendeeCountElement = document.getElementById("attendeeCount");
  attendeeCountElement.textContent = count;

  const percentage = Math.round((count / maxCount) * 100) + "%";
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  const waterCounter = document.getElementById("waterCount");
  waterCounter.textContent = attendeesByTeam.water.length;

  const zeroCounter = document.getElementById("zeroCount");
  zeroCounter.textContent = attendeesByTeam.zero.length;

  const powerCounter = document.getElementById("powerCount");
  powerCounter.textContent = attendeesByTeam.power.length;

  displayAttendeeList();
}

function displayAttendeeList() {
  const attendeeList = document.getElementById("attendeeList");
  attendeeList.innerHTML = "";

  const teams = [
    { id: "water", name: "🌊 Team Water Wise" },
    { id: "zero", name: "🌿 Team Net Zero" },
    { id: "power", name: "⚡ Team Renewables" },
  ];

  teams.forEach(function (team) {
    const attendees = attendeesByTeam[team.id];
    if (attendees.length > 0) {
      const teamSection = document.createElement("div");
      teamSection.className = "attendee-team-section";

      const teamTitle = document.createElement("h4");
      teamTitle.className = "attendee-team-title";
      teamTitle.textContent = team.name;
      teamSection.appendChild(teamTitle);

      const attendeeNames = document.createElement("ul");
      attendeeNames.className = "attendee-names";

      attendees.forEach(function (name) {
        const li = document.createElement("li");
        li.textContent = name;
        attendeeNames.appendChild(li);
      });

      teamSection.appendChild(attendeeNames);
      attendeeList.appendChild(teamSection);
    }
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  count++;
  console.log("Total Check-ins:", count);

  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);

  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  const attendeeCountElement = document.getElementById("attendeeCount");
  attendeeCountElement.textContent = count;

  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  const message = `Welcome, ${name} from ${teamName}`;
  const greetingElement = document.getElementById("greeting");
  greetingElement.textContent = message;
  greetingElement.className = "success-message";
  greetingElement.style.display = "block";

  attendeesByTeam[team].push(name);
  saveToLocalStorage();
  displayAttendeeList();

  form.reset();
});

loadFromLocalStorage();
updateUI();
